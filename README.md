# IS212 G5T3 Documentations

This project is built and developed by [Alexander Vincent Lewi](https://github.com/vincentlewi), [Dennis Hardianto](https://github.com/DennisH18), [Emily Aurelia](https://github.com/emilyaurelia), [Jordian Renaldi](https://github.com/jordianrenaldi), [Vitto Surya Tedja](https://github.com/vittotedja), [Yozafard Harold Siauheming](https://github.com/yozafard) for IS212 Software Project Management for the client All in One. Check out our [GitHub Repo](https://github.com/vittotedja/spm-g5t3)

## How to access our app

Our app's first release is available in [glasswindow.vercel.app](https://glasswindow.vercel.app/). It should cover the basic five functions that the client require.
To log in to our app you can use any of the staff's email with their username (in all lowercase) as their password
`e.g: email: ji.han@allinone.com.sg, password: ji.han`

### Local Installation

-   To use our app locally, first clone this repo to your local directory with

```bash
git clone https://github.com/vittotedja/spm-g5t3.git
```

or download our app's [source code](https://github.com/vittotedja/spm-g5t3/archive/refs/heads/master.zip)

-   Before starting our app, install all the required dependency with

```bash
npm install
pip install -r requirements.txt
```

-   To start our app you need to run two commands

```bash
npm run dev
```

and

```bash
uvicorn main:app --reload
```

-   To get access to the secret keys used inside our app. Please contact us!

### To locally test your code

Ensuring that our application is stable, testing is crucial for our development. Although CI/CD has already been implemented, here is how to test the functionalities locally.

-   CI/CD function implemented through Github Actions
    We have implemented CI/CD pipeline in github actions which can be seen from our [main.yml](https://github.com/vittotedja/spm-g5t3/blob/master/.github/workflows/main.yml), where we implemented [PyTest](https://docs.pytest.org/) for unit and integration testing, and [Cypress](https://www.cypress.io/) for End To End testing. Additionally, we have also used [Vercel](https://vercel.com/) to handle the CD pipeline to make sure that we always provide the latest release as fast as possible for the client.

-   To check for function

```bash
cd pytest
pytest
```

-   To check for End to End functionality

```bash
py ./setup_db.py
npx cypress open
```

then run your cypress test locally and see if there are any errors.

### Additional apps used in this project

-   [Supabase](https://supabase.com)
    Supabase is a database service that is based from Postgres database. It allows authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage and etc. Using Supabase ensures that our app is widely available. As developers, this allows us to focus more on building features rather than mantaining database.

-   [Clickup](https://clickup.com/)
    Clickup is a project management app that has helped us in tracking our progress. It allows us to assign user stories to individuals, create notes and documentations properly and can be integrated with GitHub to ease up our workflow.
