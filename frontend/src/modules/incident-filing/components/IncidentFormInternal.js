import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';

import {
    submitIncidentBasicData,
    stepBackwardIncidentStepper,
    stepForwardIncidentStepper,
    fetchUpdateReporter,
    fetchUpdateIncident,
    resetIncidentForm,
    submitInternalIncidentData,
    fetchUpdateInternalIncidentData
} from '../state/IncidentFiling.actions'
import {
    fetchChannels,
    fetchElections,
    fetchCategories,
    fetchProvinces,
    fetchDistricts,
    fetchDivisionalSecretariats,
    fetchGramaNiladharis,
    fetchPollingDivisions,
    fetchPoliceStations,
    fetchPollingStations,
    fetchPoliceDivisions,
    fetchWards,
    fetchActiveIncidentData,
    resetActiveIncident
} from '../../shared/state/Shared.actions';
import DropZoneBase from '../../shared/components/DropZoneBase';
import moment from 'moment';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        color: theme.palette.text.secondary,
        marginBottom: 20,
    },
    textField: {
        width: '100%'
    },
    formControl: {
        width: '100%'
    },
    datetime: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
    radioItem: {
        margin: 0,
    },
    severityHigh: {
        color: red[600],
        '&$checked': {
            color: red[500],
        },
    },
    severityMedium: {
        color: orange[600],
        '&$checked': {
            color: orange[500],
        },
    },
    severityLow: {
        color: yellow[600],
        '&$checked': {
            color: yellow[500],
        },
    },
    checked: {},
    langCats : {
        display: "flex",
        "& div": {
            padding: "0 3px"
        }
    }
})

class IncidentFormInternal extends Component {

    state = {
        infoChannel: "",
        title: "default title",
        description: "",
        occurrence: "OCCURRED",
        occured_date: "",
        time: "",
        otherCat: "",
        category: "",
        election: "",
        severity: "",
        location: "",
        address: "",
        city: "",
        province: "",
        district: "",
        divisionalSecretariat: "",
        gramaNiladhari: "",
        pollingDivision: "",
        pollingStation: "",
        policeStation: "",
        policeDivision: "",
        reporterConsent: false,
        reporterName: "",
        reporterType: "",
        reporterAddress: "",
        reporterMobile: "",
        reporterLandline: "",
        reporterEmail: "",
        file: null
    }

    componentDidMount() {
        this.props.getChannels();
        this.props.getElections();
        this.props.getCategories();
        this.props.getProvinces();
        this.props.getDistricts();
        this.props.getDivisionalSecretariats();
        this.props.getGramaNiladharis();
        this.props.getPollingDivisions();
        this.props.getPollingStations();
        this.props.getPoliceStations();
        this.props.getPoliceDivisions();
        this.props.getWards();

        this.props.resetIncidentForm();

        const { paramIncidentId } = this.props.match.params

        if (paramIncidentId) {
            this.props.getIncident(paramIncidentId);
        } else {
            this.props.resetActiveIncident();
        }
    }

    handleSubmit = (values, actions) => {


        const { paramIncidentId } = this.props.match.params

        if(values.occured_date){
            values.occured_date = moment(values.occured_date).format()
        }

        if (paramIncidentId) {
            this.props.updateInternalIncident(paramIncidentId, values);
            this.props.history.push(`/app/review/${paramIncidentId}`);
        } else {
            this.props.submitInternalIncident(values, this.state.file);
            this.props.history.push('/app/review');
        }
    }

    getInitialValues = () => {
        const { paramIncidentId } = this.props.match.params

        if (!paramIncidentId) {
            // new incident form
            return this.state;
        }

        var initData = { ...this.state, ...this.props.incident };
        const reporter = this.props.reporter;

        if (reporter) {
            Object.assign(initData, {
                "reporterName": reporter.name,
                "reporterType": reporter.reporter_type,
                "reporterEmail": reporter.email,
                "reporterMobile": reporter.telephone,
                "reporterAddress": reporter.address
            });
        }

        if(initData.occured_date){
            initData.occured_date = moment(initData.occured_date).format("YYYY-MM-DDTHH:mm")
        }

        return initData;
    }

    handleFileSelect = (selectedFile) => {
        this.setState({
            file: selectedFile
        })
    }

    render() {
        const { classes } = this.props;
        const { paramIncidentId } = this.props.match.params

        const reinit = paramIncidentId ? true : false;

        return (
            <div className={classes.root}>
                <Formik
                    enableReinitialize={reinit}
                    initialValues={this.getInitialValues()}
                    onSubmit={(values, actions) => {
                        this.handleSubmit(values, actions)
                    }}
                    render={
                        ({ handleSubmit, handleChange, handleBlur, values, errors }) => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <div style={{ display: "none" }}>{this.props.incident.id}</div>
                                {/* basic incident detail information */}
                                <Paper className={classes.paper}>
                                    <Typography variant="h5" gutterBottom>
                                        Basic Information
                                    </Typography>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12}>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="infoChannel">Received Mode</InputLabel>
                                                    <Select
                                                        value={values.infoChannel}
                                                        onChange={handleChange}
                                                        inputProps={{
                                                            name: 'infoChannel',
                                                            id: 'infoChannel',
                                                        }}
                                                    >
                                                        {this.props.channels.map((c, k) => (
                                                            <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                        ))}
                                                        <MenuItem value="Other"> Other </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                type="text"
                                                name="title"
                                                label="Title"
                                                placeholder="Title"
                                                className={classes.textField}
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                type="text"
                                                name="description"
                                                label="Description"
                                                placeholder="Press enter for new lines."
                                                className={classes.textField}
                                                multiline
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl component="fieldset" className={classes.formControl}>
                                                <FormLabel component="legend">Occurrence</FormLabel>
                                                <RadioGroup
                                                    name="occurrence"
                                                    id="occurrence"
                                                    className={classes.group}
                                                    value={values.occurrence}
                                                    onChange={handleChange}
                                                    row={true}
                                                >
                                                    <FormControlLabel value="OCCURRED" control={<Radio color="primary" />} label="Occurred" />
                                                    <FormControlLabel value="OCCURRING" control={<Radio color="primary" />} label="Occurring" />
                                                    <FormControlLabel value="WILL_OCCUR" control={<Radio color="primary" />} label="Will Occur" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <TextField
                                                margin="normal"
                                                id="occured_date"
                                                label="Incident date"
                                                type="datetime-local"
                                                value={values.occured_date}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="category">Category</InputLabel>
                                                <Select
                                                    value={values.category}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'category',
                                                        id: 'category',
                                                    }}
                                                >
                                                    {this.props.categories.map((c, k) => (
                                                        <MenuItem value={c.sub_category} key={k}>
                                                            <div className={classes.langCats}>
                                                                <div>{c.sub_category}</div>
                                                                <div>|</div>
                                                                <div> {c.sn_sub_category}</div>
                                                                <div>|</div>
                                                                <div> {c.tm_sub_category}</div>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                    <MenuItem value="Other"> Other </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                type="text"
                                                name="otherCat"
                                                label="If Other, please describe here"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.otherCat}
                                                className={classes.textField}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="election" >Election</InputLabel>
                                                <Select
                                                    value={values.election}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'election',
                                                        id: 'election',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.elections.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl component="fieldset" className={classes.formControl}>
                                                <FormLabel component="legend">Severity</FormLabel>
                                                <RadioGroup
                                                    name="severity"
                                                    id="severity"
                                                    value={values.severity}
                                                    onChange={handleChange}
                                                    row
                                                >
                                                    <FormControlLabel
                                                        value="1"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityLow,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="1"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityLow,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="2"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityLow,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="2"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityLow,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="3"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityLow,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="3"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityLow,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="4"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityMedium,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="4"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityMedium,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="5"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityMedium,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="5"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityMedium,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="6"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityMedium,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="6"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityMedium,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="7"
                                                        control={
                                                            <Radio
                                                                classes={{
                                                                    root: classes.severityHigh,
                                                                    checked: classes.checked,
                                                                }}
                                                            />
                                                        }
                                                        label="7"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityHigh,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="8"
                                                        control={<Radio className={classes.severityHigh} />}
                                                        label="8"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityHigh,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="9"
                                                        control={<Radio className={classes.severityHigh} />}
                                                        label="9"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityHigh,
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="10"
                                                        control={<Radio className={classes.severityHigh} />}
                                                        label="10"
                                                        labelPlacement="bottom"
                                                        className={classes.radioItem}
                                                        classes={{
                                                            label: classes.severityHigh,
                                                        }}
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        
                                        { !paramIncidentId && 
                                            <Grid item>
                                                <InputLabel htmlFor="election" >Upload File</InputLabel>
                                                <DropZoneBase setSelectedFiles={this.handleFileSelect} />
                                            </Grid>
                                        }

                                    </Grid>
                                </Paper>

                                {/* Incident location information */}
                                <Paper className={classes.paper}>
                                    <Typography variant="h5" gutterBottom>
                                        Location Information
                                    </Typography>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="location"
                                                label="Location / Description"
                                                className={classes.textField}
                                                value={values.location}
                                                onChange={handleChange}
                                                margin="normal"
                                                multiline
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <TextField
                                                id="address"
                                                label="Address"
                                                className={classes.textField}
                                                value={values.address}
                                                onChange={handleChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                id="city"
                                                label="City"
                                                className={classes.textField}
                                                value={values.city}
                                                onChange={handleChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="province">Province</InputLabel>
                                                <Select
                                                    value={values.province}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'province',
                                                        id: 'province',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.provinces.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="district">Districts</InputLabel>
                                                <Select
                                                    value={values.district}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'district',
                                                        id: 'district',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.districts.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="divisionalSecretariat">Divisional Secretariat</InputLabel>
                                                <Select
                                                    value={values.divisionalSecretariat}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'divisionalSecretariat',
                                                        id: 'divisionalSecretariat',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.divisionalSecretariats.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="pollingDivision">Polling Division</InputLabel>
                                                <Select
                                                    value={values.pollingDivision}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'pollingDivision',
                                                        id: 'pollingDivision',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.pollingDivisions.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="pollingStation">Polling Station</InputLabel>
                                                <Select
                                                    value={values.pollingStation}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'pollingStation',
                                                        id: 'pollingStation',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.pollingStations.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="gramaNiladhari">Grama Niladhari Division</InputLabel>
                                                <Select
                                                    value={values.gramaNiladhari}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'gramaNiladhari',
                                                        id: 'gramaNiladhari',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.gramaNiladharis.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="policeStation">Police Station</InputLabel>
                                                <Select
                                                    value={values.policeStation}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'policeStation',
                                                        id: 'policeStation',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.policeStations.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="policeDivision">Police Division</InputLabel>
                                                <Select
                                                    value={values.policeDivision}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'policeDivision',
                                                        id: 'policeDivision',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {this.props.policeDivisions.map((c, k) => (
                                                        <MenuItem value={c.name} key={k}>{c.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* contact information of the complianer */}
                                <Paper className={classes.paper}>
                                    <Typography variant="h5" gutterBottom>
                                        Complainer Information
                                    </Typography>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="reporterName"
                                                name="reporterName"
                                                label="Complainer Name"
                                                className={classes.textField}
                                                value={values.reporterName}
                                                onChange={handleChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl} >
                                                <InputLabel htmlFor="reporterType">Complainer Type</InputLabel>
                                                <Select
                                                    value={values.reporterType}
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        name: 'reporterType',
                                                        id: 'reporterType',
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    <MenuItem value={"Individual"}>Individual</MenuItem>
                                                    <MenuItem value={"Organization"}>Organization</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="reporterAddress"
                                                name="reporterAddress"
                                                label="Complainer Address"
                                                className={classes.textField}
                                                value={values.reporterAddress}
                                                onChange={handleChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="reporterMobile"
                                                name="reporterMobile"
                                                label="Complainer Mobile"
                                                className={classes.textField}
                                                value={values.reporterMobile}
                                                onChange={handleChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="reporterEmail"
                                                name="reporterEmail"
                                                label="Complainer Email"
                                                className={classes.textField}
                                                value={values.reporterEmail}
                                                onChange={handleChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        id="reporterConsent"
                                                        name="reporterConsent"
                                                        checked={values.reporterConsent}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label="Complainer details can be shared with external parties."
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* action panel */}
                                <Grid container spacing={24}>
                                    <Grid item xs={12} style={{ textAlign: "center" }}>
                                        <Button variant="contained" className={classes.button}> Cancel</Button>
                                        <Button type="submit" variant="contained" color="primary" className={classes.button}> Sumbit</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                />

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={this.state.submitSuccessMessage}
                    onClose={this.handleSuccessMessageClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Incident submitted sucessfully!</span>}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isIncidentBasicDetailsSubmitting: state.incidentReducer.guestIncidentForm.isSubmitting,
        incidentFormActiveStep: state.incidentReducer.guestIncidentForm.activeStep,

        isIncidentLoading: state.sharedReducer.activeIncident.isLoading,
        incident: state.sharedReducer.activeIncident.data,
        reporter: state.sharedReducer.activeIncidentReporter,

        incidentId: state.sharedReducer.activeIncident.data ? state.sharedReducer.activeIncident.data.id : null,
        reporterId: state.sharedReducer.activeIncidentReporter ? state.sharedReducer.activeIncidentReporter.id : null,

        channels: state.sharedReducer.channels,
        categories: state.sharedReducer.categories,
        districts: state.sharedReducer.districts,
        provinces: state.sharedReducer.provinces,
        divisionalSecretariats: state.sharedReducer.divisionalSecretariats,
        gramaNiladharis: state.sharedReducer.gramaNiladharis,
        pollingDivisions: state.sharedReducer.pollingDivisions,
        pollingStations: state.sharedReducer.pollingStations,
        policeStations: state.sharedReducer.policeStations,
        policeDivisions: state.sharedReducer.policeDivisions,
        wards: state.sharedReducer.wards,
        elections: state.sharedReducer.elections,

        ...ownProps
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitIncidentBasicDetails: (values) => {
            dispatch(submitIncidentBasicData(values))
        },
        submitInternalIncident: (values, fileData) => {
            dispatch(submitInternalIncidentData(values, fileData))
        },
        updateIncidentBasicDetails: (incidentId, incidentData) => {
            dispatch(fetchUpdateIncident(incidentId, incidentData));
        },
        updateInternalIncident: (incidentId, incidentData) => {
            dispatch(fetchUpdateInternalIncidentData(incidentId, incidentData));
        },
        submitContactDetails: (incidentId, reporterId, reporterData) => {
            dispatch(fetchUpdateReporter(incidentId, reporterId, reporterData))
        },
        stepBackward: () => {
            dispatch(stepBackwardIncidentStepper())
        },
        stepForward: () => {
            dispatch(stepForwardIncidentStepper())
        },

        getChannels: () => {
            dispatch(fetchChannels())
        },
        getElections: () => {
            dispatch(fetchElections());
        },
        getCategories: () => {
            dispatch(fetchCategories())
        },
        getProvinces: () => {
            dispatch(fetchProvinces())
        },
        getDistricts: () => {
            dispatch(fetchDistricts())
        },
        getDivisionalSecretariats: () => {
            dispatch(fetchDivisionalSecretariats())
        },
        getGramaNiladharis: () => {
            dispatch(fetchGramaNiladharis())
        },
        getPollingDivisions: () => {
            dispatch(fetchPollingDivisions())
        },
        getPollingStations: () => {
            dispatch(fetchPollingStations())
        },
        getPoliceStations: () => {
            dispatch(fetchPoliceStations())
        },
        getPoliceDivisions: () => {
            dispatch(fetchPoliceDivisions())
        },
        getWards: () => {
            dispatch(fetchWards())
        },

        getIncident: (incidentId) => {
            dispatch(fetchActiveIncidentData(incidentId))
        },

        resetActiveIncident: () => {
            dispatch(resetActiveIncident())
        },

        resetIncidentForm: () => {
            dispatch(resetIncidentForm())
        }
    }
}

export default withRouter(compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles)
)(IncidentFormInternal));
