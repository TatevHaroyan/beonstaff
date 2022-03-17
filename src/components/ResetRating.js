import React from 'react';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import Box from '@material-ui/core/Box';
import { clientRate } from "../api";
const customIcons = {
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
};
function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}
IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};
export default function CustomizedRatings(props) {
    return (
        <div>
            <Box component="fieldset" mb={3} borderColor="transparent">
                <Rating
                    disabled={props.disabled}
                    name="customized-10"
                    defaultValue={props.defaultValue}
                    max={5}
                    value={props.defaultValue}
                    onChange={(event, newValue) => {
                        if (localStorage.getItem("profession") === "manager" && newValue !== null && props.manager === props.taskManager) {
                            let data = {
                                task: props.task,
                                manager: props.manager,
                                score: newValue
                            }
                            clientRate(data)
                                .then(() => {
                                    props.getTask()
                                })
                        }
                    }}
                />
            </Box>
        </div>
    );
}