import { graphqlWithVariables, toISODate , decodeId } from "@openimis/fe-core";
import _ from "lodash";
import { EMPTY_STRING, LIMIT_COLUMNS, LIMIT_TYPES, PRICE_ORIGINS } from "./constants";

export const validateProductForm = (values, rules, isProductCodeValid) => {
  values = { ...values };

  const REQUIRED_FIELDS = [
    "code",
    "name",
    "enrolmentPeriodStartDate",
    "enrolmentPeriodEndDate",
    "coveragePeriodStartDate",
    "coveragePeriodEndDate",
    "location",
    "cardReplacementFee",
    "membershipTypes"
  ];
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!values[field] && values[field] !== 0) {
      errors[field] = true;
    }
  });

  if (values.validityTo) {
    errors.validityTo = true;
  }

  delete values.validityTo;
  delete values.validityFrom;

  if (values.enrolmentPeriodStartDate > values.enrolmentPeriodEndDate) {
    errors.enrolmentPeriodStartDate = true;
    errors.enrolmentPeriodEndDate = true;
  }


  if (!isProductCodeValid) {
    errors.isProductCodeInvalid = true;
  }

  if (Object.keys(errors).length > 0) {
    console.warn(errors);
  }

  if (values.items?.length > 0) {
    values.items.forEach((item) => {
      if (!LIMIT_COLUMNS.every((field) => validateItemOrService(item, field, rules))) {
        errors.items = true;
      }
    });
  }

  if (values.services?.length > 0) {
    values.services.forEach((service) => {
      if (!LIMIT_COLUMNS.every((field) => validateItemOrService(service, field, rules))) {
        errors.services = true;
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    console.warn(errors);
  }

  return Object.keys(errors).length === 0;
};

export const getLimitType = (limitType) => {
  return LIMIT_TYPES[limitType] ?? LIMIT_TYPES.C;
};

export const getPriceOrigin = (priceOrigin) => {
  return PRICE_ORIGINS[priceOrigin] ?? PRICE_ORIGINS.P;
};

export const validateItemOrService = (itemOrService, field, rules) => {
  if (!/^\d+(?:\.\d{0,2})?$/.test(itemOrService[field]?.toString())) return false; //check if up to two decimal points
  return !(itemOrService[field] < rules.minLimitValue && itemOrService[field] > rules.maxLimitValue);
};

export const toFormValues = (product, shouldDuplicate) => {
  return {
    ...product,
    code: shouldDuplicate ? "" : product.code ?? "",
    chfIdFormat: 2,
    ageMaximal: product.ageMaximal ? Number(product.ageMaximal) : 0,
    
    enrollmentStartDate: product.enrollmentStartDate ?? null,
    enrollmentEndDate: product.enrollmentEndDate ?? null,
  };
};

export const rulesToFormValues = (rules) => {
  return {
    ...rules,
    minLimitValue: Number(rules.minLimitValue) ?? 0.0,
    maxLimitValue: Number(rules.maxLimitValue) ?? 100.0,
  };
};

export const toInputValues = (values) => {
  const {
    uuid,
    id,
    code,
    location,
    ageMaximal,
    ...inputValues
  } = values;

 const allowedKeys = [
    "code",
    "name",
    "lumpSum",
    "cardReplacementFee",
    "premiumAdult",
    "additionalSpouseContribution",
    "penaltyPrice",
    "membershipTypes",
    "ageMaximal",
    "chfIdFormat",
    "enrolmentPeriodStartDate",
    "enrolmentPeriodEndDate",
    "coveragePeriodStartDate",
    "coveragePeriodEndDate",
    "hasNoIndigent",
    "locationId",
    "clientMutationId",
    "clientMutationLabel",
  ];

  
   const safeValues = Object.fromEntries(
    Object.entries(inputValues).filter(([key]) => allowedKeys.includes(key))
  );


  const val = {
    ...safeValues,
    ageMaximal: Number(ageMaximal),
    code: code,
    locationId:Number(decodeId(location?.id)),
  };

  return val;
};

export const fetchConnection = (fetchFn) => {
  const loadPage = async (items, pagination) => {
    try {
      const { pageInfo, data } = await fetchFn(pagination);
      items.push(...data);
      if (!pageInfo.hasNextPage) return items;

      return loadPage(items, { after: pageInfo.endCursor });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return loadPage([], {});
};

export const loadProductItems = async (uuid, dispatch) => {
  return fetchConnection(async (pagination) => {
    const { payload, error } = await dispatch(
      graphqlWithVariables(
        `
    query ($after: String, $uuid: String!) {
      product(uuid: $uuid) {
        items (first: 100, after:$after) {
          edges {
            node {
              id
              priceOrigin
              waitingPeriodAdult
              waitingPeriodChild

              limitationType
              limitationTypeR
              limitationTypeE

              limitAdult
              limitChild
              limitAdultR
              limitChildR
              limitAdultE
              limitChildE
              limitNoAdult
              limitNoChild

              ceilingExclusionAdult
              ceilingExclusionChild
              item {
                id
                uuid
                name
                code
                price
                package
                type
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `,
        { uuid, ...pagination },
      ),
    );
    if (error) {
      console.error(payload);
      throw new Error(payload);
    }
    const { product } = payload.data;
    return { data: _.map(product.items.edges, "node"), pageInfo: product.items.pageInfo };
  });
};

export const loadProductServices = async (uuid, dispatch) => {
  return fetchConnection(async (pagination) => {
    const { payload, error } = await dispatch(
      graphqlWithVariables(
        `
    query ($after: String, $uuid: String!) {
      product(uuid: $uuid) {
        services (first: 100, after:$after) {
          edges {
            node {
              id
              priceOrigin
              waitingPeriodAdult
              waitingPeriodChild

              limitationType
              limitationTypeR
              limitationTypeE

              limitAdult
              limitChild
              limitAdultR
              limitChildR
              limitAdultE
              limitChildE
              limitNoAdult
              limitNoChild

              ceilingExclusionAdult
              ceilingExclusionChild
              service {
                id
                uuid
                name
                code
                price
                level
                type
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `,
        { uuid, ...pagination },
      ),
    );
    if (error) {
      console.error(payload);
      throw new Error(payload);
    }
    const { product } = payload.data;
    return { data: _.map(product.services.edges, "node"), pageInfo: product.services.pageInfo };
  });
};
