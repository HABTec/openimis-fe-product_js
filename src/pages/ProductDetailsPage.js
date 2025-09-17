import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { withHistory, historyPush, combine, useModulesManager, useTranslations } from "@openimis/fe-core";
import { RIGHT_PRODUCT_UPDATE } from "../constants";
import {
  useProductQuery,
  useProductCreateMutation,
  useProductUpdateMutation,
  usePageDisplayRulesQuery,
  useProductDuplicateMutation,
} from "../hooks";
import { validateProductForm, toFormValues, toInputValues, rulesToFormValues } from "../utils";
import ProductForm from "../components/ProductForm/ProductForm";

const ProductDetailsPage = (props) => {
  const { match, history, location } = props;
  const modulesManager = useModulesManager();
  const { formatMessageWithValues } = useTranslations("product", modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const isProductCodeValid = useSelector((store) => store.product.validationFields?.productCode?.isValid);
  const [resetKey, setResetKey] = useState(0);
  const [isLocked, setLocked] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadedRules, setLoadedRules] = useState(false);
  const [values, setValues] = useState({});
  const [valuesRules, setValuesRules] = useState({});
  const { isLoading, error, data, refetch } = useProductQuery(
    { uuid: match.params.product_id },
    { skip: !match.params.product_id },
  );
  const { isLoadingRules, errorRules, dataRules, refetchRules } = usePageDisplayRulesQuery({ skip: true });
  const createMutation = useProductCreateMutation();
  const updateMutation = useProductUpdateMutation();
  const duplicateMutation = useProductDuplicateMutation();
  const shouldDuplicate = (location) => {
    const { pathname } = location;
    return pathname.includes("duplicate");
  };
  const shouldBeDuplicated = shouldDuplicate(location);
  function transformMembershipTypes(data) {
  if (!Array.isArray(data)) {
    return JSON.stringify(data ?? {});
  }

  if (data.length === 0) {
    return JSON.stringify({ region: "", district: "", levels: { urban: [], rural: [] } });
  }

  const firstItem = data[0];
  const regionName = firstItem?.region?.name ?? "";
  const districtName = firstItem?.district?.name ?? "";

  const output = {
    region: regionName,
    district: districtName,
    levels: { urban: [], rural: [] },
  };

  data.forEach(item => {
    const count = Number(item.levelIndex) || 0;

    const price = item.price ?? 0;

    const priceArray = Array.from({ length: count }, () => price);

    if (item.levelType === "URBAN") {
      output.levels.urban.push(...priceArray);
    } else if (item.levelType === "RURAL") {
      output.levels.rural.push(...priceArray);
    }
  });

  return JSON.stringify(output);
}


  const onSave = () => {
    setLocked(true);
    
    if (values.uuid) {
      values.membershipTypes = transformMembershipTypes(values.membershipTypes)
      shouldBeDuplicated
        ? duplicateMutation.mutate({
            ...toInputValues(values),
            clientMutationLabel: formatMessageWithValues("duplicateMutation.label", { name: values.name }),
          })
        : updateMutation.mutate({
            ...toInputValues(values),
            clientMutationLabel: formatMessageWithValues("updateMutation.label", { name: values.name }),
          });
    } else {
      values.membershipTypes = JSON.stringify(values.membershipTypes);
      createMutation.mutate({
        ...toInputValues(values, shouldBeDuplicated),
        clientMutationLabel: formatMessageWithValues("createMutation.label", { name: values.name }),
      });
    }
  };

  const onReset = () => {
    setResetKey(Date.now());
    setValues(toFormValues(data ?? {}, shouldBeDuplicated));
    if (match.params.product_id) {
      refetch();
    }
    setLocked(false);
  };

  useEffect(() => {
    if (!isLoading) {
      setValues(toFormValues(data ?? {}, shouldBeDuplicated));
      setLoaded(true);
    }
    if (!isLoadingRules) {
      setValuesRules(rulesToFormValues(dataRules.pageDisplayRules ?? {}));
      setLoadedRules(true);
    }
  }, [data, isLoading, dataRules, isLoadingRules]);

  return (
    <>
      {isLoaded && isLoadedRules && (
        <ProductForm
          readOnly={!rights.includes(RIGHT_PRODUCT_UPDATE) || !!isLocked || !!values.validityTo}
          key={resetKey}
          error={error}
          onChange={setValues}
          product={values}
          canSave={() => validateProductForm(values, valuesRules, isProductCodeValid)}
          onBack={() => historyPush(modulesManager, history, "product.productsList")}
          onSave={rights.includes(RIGHT_PRODUCT_UPDATE) ? onSave : undefined}
          onReset={onReset}
          autoFocus={shouldBeDuplicated}
          isDuplicate={shouldBeDuplicated}
        />
      )}
    </>
  );
};

const enhance = combine(withHistory);

export default enhance(ProductDetailsPage);
