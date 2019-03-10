import React, { useState } from 'react';
import {
  Grid,
  Typography,
  FormGroup,
  withStyles,
  Paper,
  Input,
  Fab
} from '@material-ui/core';
import Send from '@material-ui/icons/Send';

const axios = require('axios');

const styles = theme => ({
  container: {
    border: `1px solid ${theme.palette.secondary.main}`,
    ...theme.mixins.gutters(),
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 8,
    marginTop: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 4,
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.dark,
    [theme.breakpoints.only('sm')]: {
      width: '60vw'
    },
    [theme.breakpoints.only('xs')]: {
      width: '90vw'
    },
    maxWidth: 600
  },
  textField: {
    background: '#FFFFFF',
    borderRadius: 5,
    width: '80%'
  },
  inputName: {
    marginBottom: theme.spacing.unit,
    padding: '.75%',
    paddingLeft: 14,
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    fontSize: '1em',
    width: '75%',
    borderRadius: 5
  },
  inputQuestion: {
    marginBottom: theme.spacing.unit,
    padding: '5%',
    paddingLeft: 14,
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    fontSize: '1em',
    width: '75%',
    borderRadius: 5
  },
  inputMultipleChoice: {
    marginBottom: theme.spacing.unit,
    padding: '.75%',
    paddingLeft: 14,
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    fontSize: '1em',
    width: '100%',
    borderRadius: 5
  },
  multipleChoice: {
    margin: '3% 1%',
    padding: '2% 10%',
    color: theme.palette.primary.main,
    fontSize: '1em',
    borderRadius: 5,
    width: '100%'
  },
  form1: {
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'column nowrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: theme.spacing.unit * 2
  },
  hrStyle: {
    margin: '1rem auto',
    width: '100%'
  },
  buttonDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing.unit * 2
    }
  },
  submitBtn: {
    marginLeft: theme.spacing.unit,
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    width: 40,
    height: 40
  },
  submitText: {
    marginRight: theme.spacing.unit
  }
});

function Refreshr(props) {
  const { sendRefreshrToDB, classes } = props;
  const [reviewText, setReviewText] = useState('');
  const [refreshrName, addRefreshrName] = useState('');
  const [questionTextOne, setQuestionTextOne] = useState('');
  const [questionTextTwo, setQuestionTextTwo] = useState('');
  //const [submitted, setSubmitted] = useState(false);

  const [a1Text, setA1Text] = useState('');
  const [a2Text, setA2Text] = useState('');
  const [a3Text, setA3Text] = useState('');
  const [a4Text, setA4Text] = useState('');
  const [questionObject, setQuestionObject] = useState({
    reviewText,
    refreshrName,
    questionTextOne,
    questionTextTwo,
    answers: { a1Text, a2Text, a3Text, a4Text }
  });
  console.log('Props from ref', props);

  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_TYPEFORM}`
  };
  /* We should use this later on other pages
    that way we can give the user an indication that an action was successful
  */
  //   const StyleDisplay = styled.a`
  //   ${{ display: submitted ? 'block' : 'none' }}
  // `;
  const createForm = async event => {
    event.preventDefault();
    const data = {
      title: 'Refreshr',
      variables: {
        score: 0
      },
      welcome_screens: [
        {
          title: questionObject.refreshrName
        }
      ],
      fields: [
        {
          title: 'Please enter your email address.',
          type: 'email',
          validations: {
            required: true
          }
        },
        {
          ref: 'question_1',
          title: questionObject.questionTextOne,
          type: 'multiple_choice',
          properties: {
            description: questionObject.reviewText,
            randomize: true,
            choices: [
              {
                ref: 'correct',
                label: questionObject.answers.a1Text
              },
              {
                ref: 'incorrect_1',
                label: questionObject.answers.a2Text
              },
              {
                ref: 'incorrect_2',
                label: questionObject.answers.a3Text
              },
              {
                ref: 'incorrect_3',
                label: questionObject.answers.a4Text
              }
            ]
          }
        },
        {
          ref: 'question_2',
          title: questionObject.questionTextTwo,
          type: 'short_text',
          properties: {
            description: questionObject.reviewText
          }
        }
      ]
    };
    try {
      await axios
        .post('https://api.typeform.com/forms', data, {
          headers
        })
        .then(res => {
          const newRefreshr = {
            name: res.data.title,
            review_text: res.data.fields[1].properties.description,
            typeform_id: res.data.id,
            typeform_url: res.data._links.display
          };
          sendRefreshrToDB(newRefreshr);
        });
    } catch (error) {
      console.log(error);
    }
    //setSubmitted(true);
  };

  //post the newly created refreshr to the refreshrs table. Returns refreshr id
  // const addRefreshr = async id => {
  //   try {
  //     const response = await axios
  //       .post('http://localhost:9000/refreshrs', id, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //       .then(res => res);
  //     setRefreshrId(response);
  //     console.log('New Refreshr ID ===', response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // //post the refreshr id to the teachers table
  // const addRefreshrId = async id => {
  //   try {
  //     const response = await axios
  //       .post(`http://localhost:9000/teachers/${userId}/refreshrs`, id, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //       .then(res => res);
  //     console.log('Res from id => teachers ===', response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // //gets refreshrs associated with the logged in teacher
  // const getTeacherRefreshrs = async () => {
  //   try {
  //     const response = await axios
  //       .get(`http://localhost:9000/teachers/${userId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //       .then(res => res);
  //     console.log('Getting teachers 🙏 ===', response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log('USer id ==', userId);
  // console.log('typeformId ==>', typeformId);
  return (
    <Paper className={classes.container} elevation={24}>
      <Grid className={classes.wrapper}>
        <FormGroup
          onChange={() =>
            setQuestionObject({
              reviewText,
              refreshrName,
              questionTextOne,
              questionTextTwo,
              answers: { a1Text, a2Text, a3Text, a4Text }
            })
          }
        >
          <Typography variant="h6" color="secondary" align={'center'}>
            Create Your Refreshr
          </Typography>

          <hr className={classes.hrStyle} />

          <Typography variant="body1" color="secondary" align={'center'}>
            Refreshr Name
          </Typography>

          <FormGroup className={classes.form1} onSubmit={props.handleSubmit}>
            <Input
              disableUnderline
              onChange={e => addRefreshrName(e.target.value)}
              name="classnameInput"
              required
              placeholder="Enter Refreshr Name.."
              className={classes.inputName}
            />
          </FormGroup>

          <hr className={classes.hrStyle} />

          <Typography variant={'body1'} color="secondary" align={'center'}>
            Add Review Text
          </Typography>

          <FormGroup className={classes.form1} onSubmit={props.handleSubmit}>
            <Input
              disableUnderline
              onChange={e => setReviewText(e.target.value)}
              name="classnameInput"
              required
              multiline
              rows="4"
              placeholder="Enter info about the Refreshr.."
              className={classes.inputQuestion}
            />
          </FormGroup>

          <hr className={classes.hrStyle} />

          <Typography
            variant={'body1'}
            color="secondary"
            align={'center'}
            gutterBottom
          >
            Create Questions
          </Typography>

          <Typography variant={'caption'} color="secondary" align={'center'}>
            Multiple Choice Question
          </Typography>
          <FormGroup className={classes.form1} onSubmit={props.handleSubmit}>
            <Input
              disableUnderline
              onChange={e => setQuestionTextOne(e.target.value)}
              name="classnameInput"
              required
              multiline
              rows="4"
              placeholder="Enter question.."
              className={classes.inputQuestion}
            />
          </FormGroup>

          <FormGroup>
            <form className={classes.multipleChoice}>
              <Input
                disableUnderline
                onChange={e => setA1Text(e.target.value)}
                name="classnameInput"
                required
                placeholder="Answer one.."
                className={classes.inputMultipleChoice}
              />
              <Input
                disableUnderline
                name="classnameInput"
                onChange={e => setA2Text(e.target.value)}
                required
                placeholder="Answer two.."
                className={classes.inputMultipleChoice}
              />
              <Input
                disableUnderline
                onChange={e => setA3Text(e.target.value)}
                name="classnameInput"
                required
                placeholder="Answer three.."
                className={classes.inputMultipleChoice}
              />
              <Input
                disableUnderline
                onChange={e => setA4Text(e.target.value)}
                name="classnameInput"
                required
                placeholder="Answer four.."
                className={classes.inputMultipleChoice}
              />
            </form>
          </FormGroup>

          <hr className={classes.hrStyle} />

          <Typography variant={'caption'} color="secondary" align={'center'}>
            Short Answer Question
          </Typography>

          <FormGroup className={classes.form1} onSubmit={props.handleSubmit}>
            <Input
              disableUnderline
              name="classnameInput"
              onChange={e => setQuestionTextTwo(e.target.value)}
              required
              multiline
              rows="4"
              placeholder="Enter question.."
              className={classes.inputQuestion}
            />
          </FormGroup>

          <hr className={classes.hrStyle} />
          <div className={classes.buttonDiv}>
            <Typography
              variant="body2"
              color="secondary"
              className={classes.submitText}
            >
              SUBMIT
            </Typography>
            <Fab
              elevation={20}
              aria-label="Submit"
              className={classes.submitBtn}
            >
              <Send
                onClick={e => {
                  props.addQuestions(questionObject);
                  createForm(e);
                }}
              />
            </Fab>
            {/* <StyleDisplay>View your Refreshr here: {url}</StyleDisplay> */}
          </div>
        </FormGroup>
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(Refreshr);
