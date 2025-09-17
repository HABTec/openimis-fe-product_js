import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  combine,
  NumberInput,
  PublishedComponent,
  TextInput,
  useModulesManager,
  useTranslations,
  ValidatedTextInput,
  withModulesManager,
  decodeId
} from "@openimis/fe-core";
import {
  clearProduct,
  fetchProduct,
  productCodeSetValid,
  productCodeValidationCheck,
  productCodeValidationClear,
} from "../../actions";

const styles = (theme) => ({
  item: theme.paper.item,
});

const MainPanelForm = (props) => {
  const {
    autoFocus,
    classes,
    edited,
    onEditedChanged,
    readOnly,
    isProductCodeValid,
    isProductCodeValidating,
    productCodeValidationError,
    isDuplicate,
  } = props;

  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.FormMainPanel", modulesManager);

  useEffect(() => {
    if (edited?.id) dispatch(fetchProduct(modulesManager, { "productId": edited.id }));
    return () => dispatch(clearProduct());
  }, [edited?.id]);

  const shouldValidate = (inputValue) => {
    const { savedProductCode } = props;
    if ((!!edited.id && inputValue === savedProductCode) || (!savedProductCode && !!edited.id)) return false;
    return true;
  };
  return (
    <Grid container direction="row">
      <Grid item xs={3} className={classes.item}>
        <ValidatedTextInput
          itemQueryIdentifier="productCode"
          action={productCodeValidationCheck}
          autoFocus={autoFocus}
          clearAction={productCodeValidationClear}
          setValidAction={productCodeSetValid}
          shouldValidate={shouldValidate}
          codeTakenLabel="product.alreadyTaken"
          readOnly={readOnly}
          isValid={isProductCodeValid}
          isValidating={isProductCodeValidating}
          validationError={productCodeValidationError}
          label="product.code"
          module="product"
          onChange={(code) => onEditedChanged({ ...edited, code })}
          required={true}
          value={edited?.code ?? ""}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="product"
          required
          label="name"
          readOnly={readOnly}
          value={edited?.name ?? ""}
          onChange={(name) => onEditedChanged({ ...edited, name })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="location.RegionPicker"
          value={edited.location?.parent?.parent ?? edited.location?.parent ?? edited.location }
          readOnly={readOnly}
          withNull={false}
          onChange={(location) => onEditedChanged({ ...edited, location })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          region={edited.location?.parent || edited.location}
          value={edited.location?.parent?.parent ? edited.location.parent : null}
          pubRef="location.DistrictPicker"
          withNull={false}
          readOnly={readOnly}
          onChange={(location) => onEditedChanged({ ...edited, location: location || edited.location?.parent })}
        />
      </Grid>
    <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="location.LocationPicker"
          onChange={(location) =>onEditedChanged({ ...edited, location: location || edited.location?.parent?.parent })}
          required
          readOnly={readOnly}
          // filterOptions={filterParents}
          value={edited.location?.parent?.parent ? edited.location : null}
          locationLevel={2}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          min={0}
          module="product"
          label="ageMaximal"
          readOnly={readOnly}
          value={edited?.ageMaximal ?? ""}
          onChange={(ageMaximal) => onEditedChanged({ ...edited, ageMaximal })}
        />
      </Grid>
     
    </Grid>
  );
};

const mapStateToProps = (store) => ({
  isProductCodeValid: store.product.validationFields?.productCode?.isValid,
  isProductCodeValidating: store.product.validationFields?.productCode?.isValidating,
  productCodeValidationError: store.product.validationFields?.productCode?.validationError,
  savedProductCode: store.product?.product?.code,
});

const enhance = combine(withModulesManager, withTheme, withStyles(styles), connect(mapStateToProps));

export default enhance(MainPanelForm);
