import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, useTranslations, NumberInput, useModulesManager, PublishedComponent } from "@openimis/fe-core";
import SectionTitle from "../SectionTitle";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { number } from "prop-types";

const PaymentScaleForm = (props) => {

    const { edited, onEditedChanged, readOnly, classes } = props;
    const modulesManager = useModulesManager();
    const { formatMessage } = useTranslations("product.PaymentTabForm", modulesManager);
    const [urbalInputs, setUrbalInputs] = React.useState([]);
    const [ruralInputs, setRuralInputs] = React.useState([]);
    const handleUrbanChange = (index, event) => {
        const newInputs = [...urbalInputs];
        newInputs[index] = Number(event.target.value);
        setUrbalInputs(newInputs);
        onEditedChanged({ ...edited, membershipTypes: formatState() })
    };
    useEffect(() => {
        const urbanPrices = [];
        const ruralPrices = [];
        if(!!edited && !!edited.membershipTypes && Array.isArray(edited?.membershipTypes) ) {
            console.log(typeof edited.membershipTypes , edited.membershipTypes)
            edited?.membershipTypes?.forEach(item => {
                if (item?.levelType === "URBAN") {
                    urbanPrices.push(item?.price);
                } else if (item?.levelType === "RURAL") {
                    ruralPrices.push(item?.price);
                }
            });
            setUrbalInputs(prev => urbanPrices);
            setRuralInputs(prev => ruralPrices);
            onEditedChanged({ ...edited, membershipTypes: formatState() })
        }
        else if(!!edited && !!edited.membershipTypes && !Array.isArray(edited?.membershipTypes)){
            setUrbalInputs(prev => edited?.membershipTypes?.levels?.urban );
            setRuralInputs(prev => edited?.membershipTypes?.levels?.rural );
            onEditedChanged({ ...edited, membershipTypes: formatState() })
        }
    }, []);
    
    const addUrbanField = (e) => {
        e.preventDefault();
        setUrbalInputs([...urbalInputs, '']);
    };

    const handleRuralChange = (index, event) => {
        const newInputs = [...ruralInputs];
        newInputs[index] = Number(event.target.value);
        setRuralInputs(newInputs);
        onEditedChanged({ ...edited, membershipTypes: formatState() })
    };

    const addRuralField = (e) => {
        e.preventDefault();
        setRuralInputs([...ruralInputs, '']);
    };

    const deleteUrbanField = (index) => {
        const newInputs = [...urbalInputs];
        newInputs.splice(index, 1);
        setUrbalInputs(newInputs);
    };

    const deleteRuralField = (index) => {
        const newInputs = [...ruralInputs];
        newInputs.splice(index, 1);
        setRuralInputs(newInputs);
    };
    const formatState = () => {
        let numberUrbal = urbalInputs.filter((value) => !isNaN(value) && value !== '');
        let numberRural = ruralInputs.filter((value) => !isNaN(value) && value !== '');
        
        return {
            region: edited?.location?.name,
            district: edited?.location?.parent?.name,
            levels: {
                urban: numberUrbal,
                rural: numberRural
            },
        };
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <SectionTitle label={formatMessage("ruralSclae")} />
            </Grid>
            
            {ruralInputs.map((value, index) => (
                <Grid item xs={12} container className={classes.item} style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={3}>
                        <TextField
                            key={index}
                            label={`Level ${index + 1}`}
                            type="number"
                            value={value}
                            onChange={(e) => handleRuralChange(index, e)}
                            placeholder={`Input ${index + 1}`}
                            style={{ display: 'block', marginBottom: '10px' }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <IconButton aria-label="delete" color="primary" onClick={() => deleteRuralField(index)}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12} spacing={2}>
            <Button color="primary" variant="contained" onClick={addRuralField}>Add Rural Scale</Button>
            </Grid>
            <Grid item xs={12} >
                <SectionTitle label={formatMessage("urbalScale")} />
            </Grid>
            {urbalInputs.map((value, index) => (
                <Grid item xs={12} container className={classes.item} style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={3}>                    
                        <TextField
                            key={index}
                            label={`Level ${index + 1}`}
                            type="number"
                            value={value}
                            onChange={(e) => handleUrbanChange(index, e)}
                            placeholder={`Input ${index + 1}`}
                            style={{ display: 'block', marginBottom: '10px' }}
                        />
                    </Grid>
                    <Grid item xs={3}>                    
                        <IconButton aria-label="delete" color="primary" onClick={() => deleteUrbanField(index)}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12} spacing={2}>
            <Button color="primary" variant="contained" onClick={addUrbanField}>Add  Urbal Input</Button>
            </Grid>
        </Grid>
    );
};

const styles = (theme) => ({
    item: theme.paper.item,
});

const enhance = combine(withTheme, withStyles(styles));

export default enhance(PaymentScaleForm);

