import React from "react";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, useTranslations, NumberInput, useModulesManager , PublishedComponent} from "@openimis/fe-core";
import SectionTitle from "../SectionTitle";

const EnrollmentForm = (props) => {
    const { edited, onEditedChanged, readOnly, classes } = props;
    const modulesManager = useModulesManager();
    const { formatMessage } = useTranslations("product.EnrollmentTabForm", modulesManager);
    return (
        <Grid container>
            <Grid item xs={12}>
                <SectionTitle label={formatMessage("enrollmentTitle")} />
            </Grid>
            <Grid item xs={6} className={classes.item}>
                <PublishedComponent
                    pubRef="core.DatePicker"
                    value={edited?.enrollmentStartDate}
                    module="product"
                    label="product.dateFrom"
                    onChange={(startDate) => onEditedChanged({ ...edited, enrollmentStartDate: startDate })}
                    />
            </Grid>
            <Grid item xs={6} className={classes.item}>
                <PublishedComponent
                    pubRef="core.DatePicker"
                    value={edited?.enrollmentEndDate}
                    module="product"
                    label="product.dateTo"
                    onChange={(endDate) => onEditedChanged({ ...edited, enrollmentStartDate: endDate })}
                />
            </Grid>


        </Grid>
    );
};

const styles = (theme) => ({
    item: theme.paper.item,
});

const enhance = combine(withTheme, withStyles(styles));

export default enhance(EnrollmentForm);
