import React, { useRef } from "react";
import { Grid , Box , Button} from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, useTranslations, NumberInput, useModulesManager, TextInput } from "@openimis/fe-core";
import Tooltip from '@material-ui/core/Tooltip';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import InfoIcon from '@material-ui/icons/Info';


const ContributionTabForm = (props) => {
  const { edited, onEditedChanged, readOnly, classes } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.ContributionTabForm", modulesManager);
  const conf = modulesManager.getConf("product", "penalityConfig", [])
  const inputRef = useRef(null);

  const insertAtCursor = (text) => {
    text = '{'+text+'}';
    const input = inputRef.current;
    console.log("input", input , input.selectionEnd , input.selectionStart);
    if (!input) return; // safety check
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const value = edited?.penalityFormula ?? "";
    const newValue =
      value.substring(0, start) + text + value.substring(end);

    onEditedChanged({...edited , penalityFormula: newValue});

    // after state update, restore cursor just after inserted text
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  function isValidMathExpression(expr) {
    const regex = /^\s*(?:\{[a-zA-Z_][a-zA-Z0-9_]*\}|\d*\.?\d+|\((?:[^()]+|\([^()]*\))*\))\s*(?:[+\-*/]\s*(?:\{[a-zA-Z_][a-zA-Z0-9_]*\}|\d*\.?\d+|\((?:[^()]+|\([^()]*\))*\))\s*)*$/;
    if(!regex.test(expr) && expr !== "") {
      return "Invalid Expression"
    }
  }

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
              value={edited?.premiumAdult ?? ""}
              onChange={(premiumAdult) => onEditedChanged({ ...edited, premiumAdult })}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          required
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
          required
          readOnly={readOnly}
          value={edited?.additionalSpouseContribution ?? ""}
          onChange={(additionalSpouseContribution) => onEditedChanged({ ...edited, additionalSpouseContribution })}
        />
      </Grid>
     
      <Grid item xs={12} className={classes.item} >
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={6}>
            <TextInput
              module="product"
              required
              error={isValidMathExpression(edited?.penalityFormula ?? "")}
              label="PanishmentFormula"
              readOnly={readOnly}
              value={edited?.penalityFormula ?? ""}
              inputRef={inputRef}
              onChange={(penalityFormula) => onEditedChanged({ ...edited, penalityFormula })}
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container>
                {
                conf.length > 0 ? conf.map((c, i) => (
                  <Button
                    variant="outlined"
                    color="primary"
                    key={i}
                    onClick={() => insertAtCursor(c?.code)}
                    style={{ textTransform: "none", padding: "12px 20px", width: '100%', margin: 2 }}
                  >
                    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                      <Typography variant="body1" style={{ fontWeight: "bold" }}>
                        {formatMessage("product.ContributionTabForm."+c?.code)}
                        {/* {"product.ContributionTabForm"+c?.code} */}
                      </Typography>
                      <Typography variant="caption" color="inherit">
                        {/* {c?.description} */}
                        {formatMessage("product.ContributionTabForm."+c?.code+"Description")}
                      </Typography>
                    </Box>
                  </Button>
                )) : <div style={{ fontSize: 12 }}></div>
              }
            
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  item: theme.paper.item,
});

const enhance = combine(withTheme, withStyles(styles));

export default enhance(ContributionTabForm);
