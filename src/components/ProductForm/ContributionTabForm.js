import React from "react";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, useTranslations, NumberInput, useModulesManager } from "@openimis/fe-core";

const ContributionTabForm = (props) => {
  const { edited, onEditedChanged, readOnly, classes } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.ContributionTabForm", modulesManager);
  return (
    <Grid container>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="lumpSum"
          required
          readOnly={readOnly}
          value={edited?.lumpSum ?? ""}
          onChange={(lumpSum) => onEditedChanged({ ...edited, lumpSum })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="premiumAdult"
          readOnly={readOnly}
          value={edited?.premiumAdult ?? ""}
          onChange={(premiumAdult) => onEditedChanged({ ...edited, premiumAdult })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="registrationFee"
          readOnly={readOnly}
          value={edited?.registrationFee ?? ""}
          onChange={(registrationFee) => onEditedChanged({ ...edited, registrationFee })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          required
          label="CardReplacementFee"
          readOnly={readOnly}
          value={edited?.cardReplacementFee ?? ""}
          onChange={(cardReplacementFee) => onEditedChanged({ ...edited, cardReplacementFee })}
        />
      </Grid>
      {/* <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="generalAssemblyLumpSum"
          readOnly={readOnly}
          value={edited?.generalAssemblyLumpSum ?? ""}
          onChange={(generalAssemblyLumpSum) => onEditedChanged({ ...edited, generalAssemblyLumpSum })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="generalAssemblyFee"
          readOnly={readOnly}
          value={edited?.generalAssemblyFee ?? ""}
          onChange={(generalAssemblyFee) => onEditedChanged({ ...edited, generalAssemblyFee })}
        />
      </Grid> */}
    </Grid>
  );
};

const styles = (theme) => ({
  item: theme.paper.item,
});

const enhance = combine(withTheme, withStyles(styles));

export default enhance(ContributionTabForm);
