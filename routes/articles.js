const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth-user.js");

//const AuthController = require("../controllers/AuthController");

const NewsAPI = require("newsapi");
const { default: mongoose } = require("mongoose");
const { findById } = require("../models/Post.js");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// for user health
const User = require("../models/User.js");

// new '/' API route to get more relevant set articles
router.get("/", auth, async (req, res) => {
  //create array
  //   status: 'ok',
  //   totalResults: 0,
  //   articles: [
  //     {
  //       title: "'I'm still shocked by the fact people are eating pet food'",
  //       author: null,
  //       source: [Object],
  //       publishedAt: '2022-11-30T22:57:06Z',
  //       url: 'https://www.bbc.co.uk/news/av/uk-wales-63800953'
  //     },
  //   ]
  var articlesToReturn = {
    status: "ok",
    articles: [],
  };

  // assess users health information
  user = await User.findById(req.user.id);
  console.log(user);

  // age
  if (user.age < 18) {
    articlesToReturn.articles.push({
      title: "Health Growth and Change",
      url: "https://www.bbc.co.uk/bitesize/topics/znhmwty/articles/zrbhmfr",
      image: "https://ichef.bbci.co.uk/images/ic/320xn/p080zfbj.png",
    });
  } else if (user.age < 30) {
    // article for young adults
  } else if (user.age < 50) {
    // article for middle aged adults
  } else {
    // article for elderly
  }

  // BMI]
  //user height in m from cm
  user.heightInM = user.height / 100;
  user.BMI = user.weight / (user.heightInM * user.heightInM);
  NHS_MAX_BMI = 25;
  NHS_MIN_BMI = 18.5;
  if (user.BMI > NHS_MAX_BMI) {
    articlesToReturn.articles.push({
      title: "12 tips to help you lose weight",
      url: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/12-tips-to-help-you-lose-weight/",
      image:
        "https://assets.nhs.uk/nhsuk-cms/images/T_0318_sucessful-diet-tips_486507818.width-1019.jpg",
    });
  } else if (user.BMI < NHS_MIN_BMI) {
    articlesToReturn.articles.push({
      title: "Underweight adults",
      url: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/advice-for-underweight-adults/",
      image:
        "https://www.england.nhs.uk/nhsidentity/wp-content/uploads/sites/38/2016/04/nhs-logo-digital-space.jpg",
    });
  }

  // Exercise
  if (user.avgHrsExercisePW == "none" || user.exercise == "1") {
    articlesToReturn.articles.push({
      title: "How to workout at home",
      url: "https://www.bbcgoodfood.com/howto/guide/how-work-out-home",
      image:
        "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/weights-6c5c05d.jpg?quality=90&webp=true&resize=300,272",
    });
  }

  // Daily Steps
  if (
    (user.avgStepsPD =
      "0-999" ||
      user.avgStepsPD == "1000-1999" ||
      user.avgStepsPD == "2000-3999" ||
      user.avgStepsPD == "4000-6999" ||
      user.avgStepsPD == "7000-9999")
  ) {
    articlesToReturn.articles.push({
      title: "Walking for health",
      url: "https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/walking-for-health/",
      image:
        "https://assets.nhs.uk/nhsuk-cms/images/T_0318_walking-getting-started_500293387.width-1019.jpg",
    });
  }

  // Eating Habits
  if (
    user.eatingHabits == "Very Unhealthy" ||
    user.eatingHabits == "Unhealthy" ||
    user.eatingHabits == "Bellow Average"
  ) {
    articlesToReturn.articles.push({
      title: "8 tips for healthy eating",
      url: "https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/eight-tips-for-healthy-eating/",
      image:
        "https://www.england.nhs.uk/nhsidentity/wp-content/uploads/sites/38/2016/04/nhs-logo-digital-space.jpg",
    });
  }

  // Sleep
  console.log("sleep: " + user.avgHrsSleepPD)
  if (user.avgHrsSleepPD == "0-3" || user.avgHrsSleepPD == "4-5") {
    articlesToReturn.articles.push({
      title: "How to get a good night's sleep",
      url: "https://www.nhs.uk/every-mind-matters/coronavirus/how-to-fall-asleep-faster-and-sleep-better/",
      image:
        "https://assets.nhs.uk/campaigns-cms-prod/images/Coronavirus_tip_-__Maintain_a_routine.width-510.png",
    });
  }

  // Alcohol
  if (user.avgUnitsAlcoholPW == "15-18" || user.avgUnitsAlcoholPW == "18+") {
    articlesToReturn.articles.push({
      title: "The risks of drinking too much",
      url: "https://www.nhsinform.scot/healthy-living/alcohol/the-risks-of-drinking-too-much",
      image:
        "https://www.england.nhs.uk/nhsidentity/wp-content/uploads/sites/38/2016/04/nhs-logo-digital-space.jpg",
    });
  }

  // Occupation
  if (
    user.occupation == "Home Worker" ||
    user.occupation == "Other (Non-sedentary work)"
  ) {
    articlesToReturn.articles.push({
      title:
        "https://www.nhs.uk/every-mind-matters/coronavirus/simple-tips-to-tackle-working-from-home/",
      url: "https://www.nhs.uk/every-mind-matters/coronavirus/simple-tips-to-tackle-working-from-home/",
      image:
        "https://assets.nhs.uk/campaigns-cms-prod/images/Coronavirus_tip_-_Stick_to_daily_routines.width-510.png",
    });
  }

  // ensure at least 3 articles are returned
  if (articlesToReturn.articles.length < 3) {
    articlesToReturn.articles.push({
      title: "Physical activity guidelines for adults aged 19 to 64",
      url: "https://www.nhs.uk/live-well/exercise/exercise-guidelines/physical-activity-guidelines-for-adults-aged-19-to-64/",
      image: "https://www.england.nhs.uk/nhsidentity/wp-content/uploads/sites/38/2016/04/nhs-logo-digital-space.jpg",
    });
    articlesToReturn.articles.push({
      title: "5 steps to mental wellbeing",
      url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/",
      image: "https://www.england.nhs.uk/nhsidentity/wp-content/uploads/sites/38/2016/04/nhs-logo-digital-space.jpg"
    });
    articlesToReturn.articles.push({
      title: "Self-help tips to fight tiredness",
      url: "https://www.nhs.uk/live-well/sleep-and-tiredness/self-help-tips-to-fight-fatigue/",
      image: "https://www.england.nhs.uk/nhsidentity/wp-content/uploads/sites/38/2016/04/nhs-logo-digital-space.jpg"
    });
  }

  // randomise order of articles to return
  articlesToReturn.articles.sort(() => Math.random() - 0.5);
  res.send(articlesToReturn);

  //
});

// // method to be developed when a better API than NEWS API is found
// router.get ("/", auth, async (req, res) => {
//     //create array
//     searchTerms = [];

//     // assess users health information
//     user = await User.findById(req.user.id);
//     console.log(user);

//     // age
//     if (user.age < 18) {
//         searchTerms.push("teen");
//         searchTerms.push("child");
//     } else if (user.age < 30) {
//         searchTerms.push("young adult");
//     } else if (user.age < 50) {
//         searchTerms.push("adult");
//     } else {
//         searchTerms.push("senior");
//     }

//     // BMI
//     userBMI = user.weight / (user.height * user.height);
//     NHS_MAX_BMI = 25;
//     NHS_MIN_BMI = 18.5;
//     if (user.BMI > NHS_MAX_BMI) {
//         searchTerms.push("overweight");
//     } else if (user.BMI < NHS_MIN_BMI) {
//         searchTerms.push("underweight");
//     }

//     // Exercise
//     if (user.avgHrsExercisePW == "none" || user.exercise == "1") {
//         searchTerms.push("exercise");
//     }

//     // Daily Steps
//     if (user.avgStepsPD = "0-999" || user.avgStepsPD == "1000-1999" || user.avgStepsPD == "2000-3999" || user.avgStepsPD == "4000-6999" || user.avgStepsPD == "7000-9999") {
//         searchTerms.push("steps");
//     }

//     // Eating Habits
//     if (user.eatingHabits == "Very Unhealthy" || user.eatingHabits == "Unhealthy" || user.eatingHabits == "Bellow Average") {
//         searchTerms.push("healthy eating");
//     }

//     // Sleep
//     if (user.avgSleepHrsPD == "0-3" || user.avgSleepHrsPD == "4-5") {
//         searchTerms.push("sleep");
//     }

//     // Alcohol
//     if (user.avgUnitsAlcoholPW == "15-18" || user.avgUnitsAlcoholPW == "18+") {
//         searchTerms.push("alcohol");
//     }

//     // Occupation
//     if (user.occupation == "None" || user.occupation == "Other (Non-sedentary work)") {
//     } else {
//         searchTerms.push(user.occupation);
//     }

//     console.log("search terms: " + searchTerms);

//     // make searchTerms into a string
//     searchTermsString = searchTerms.join(" OR ");
//     console.log("search terms string: " + searchTermsString);
//     newsapi.v2.everything({
//         q: searchTermsString,
//         sources: 'bbc-news',
//         domains: 'bbc.co.uk',
//         from: '2022-11-07',
//         to: '2022-12-01',
//         language: 'en',
//         sortBy: 'relevancy',
//         page: 1
//       }).then(response => {
//         res.send(response);
//         /*
//           {
//             status: "ok",
//             articles: [...]
//           }
//         */
//       });
// });

router.get("/category/:category", auth, async (req, res) => {
  // catagory?catagory=health

  //console.log(req.query.category);

  // get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  console.log(today);

  // get date 1 month ago
  var oneMonthAgo = new Date();
  var m = oneMonthAgo.getMonth();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  // If still in same month, set date to last day of previous month
  if (oneMonthAgo.getMonth() == m) oneMonthAgo.setDate(0);
  oneMonthAgo.setHours(0, 0, 0, 0);

  oneMonthAgo = oneMonthAgo.toISOString().split("T")[0];

  console.log(oneMonthAgo);

  newsapi.v2
    .everything({
      q: req.params.category,
      sources: "bbc-news",
      domains: "bbc.co.uk",
      from: oneMonthAgo,
      to: today,
      language: "en",
      sortBy: "relevancy",
      page: 1,
    })
    .then((response) => {
      res.send(response);
      /*
          {
            status: "ok",
            articles: [...]
          }
        */
    });
});

module.exports = router;
