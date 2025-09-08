import React from "react";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, useTranslations, NumberInput, useModulesManager } from "@openimis/fe-core";
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import InfoIcon from '@material-ui/icons/Info';

const ContributionTabForm = (props) => {
  const { edited, onEditedChanged, readOnly, classes } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.ContributionTabForm", modulesManager);
  return (
    <Grid container>
      <Grid item xs={3} className={classes.item}>
        <Grid container justifyContent="center"
          alignItems="center" spacing={1}>
          <Grid item xs={1}>
            <Tooltip title="Enter a percentage value. This determines how much the adults will pay out of the family package.">
              <InfoIcon style={{ fontSize: 15 }} />
            </Tooltip>
          </Grid>
          <Grid item xs={11}>
            <NumberInput
              module="product"
              min={0}
              max={100}
              required
              label="premiumAdult"
              readOnly={readOnly}
              value={edited?.premiumAdult ?? 75}
              onChange={(premiumAdult) => onEditedChanged({ ...edited, premiumAdult })}
            />
          </Grid>
        </Grid>
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
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          max={100}
          label="additionalWifePayment"
          readOnly={readOnly}
          value={edited?.additionalSpouseContribution ?? ""}
          onChange={(additionalSpouseContribution) => onEditedChanged({ ...edited, additionalSpouseContribution })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          label="penalityFee"
          readOnly={readOnly}
          value={edited?.penaltyPrice ?? ""}
          onChange={(penaltyPrice) => onEditedChanged({ ...edited, penaltyPrice })}
        />
      </Grid>
      {/* <Grid item xs={3} className={classes.item}>
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
