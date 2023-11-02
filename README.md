# IS212 G5T3 Documentations

This project is built and developed by [@DennisH18], [@emilyaurelia], [@jordianrenaldi], [@vincentlewi], [@vittotedja], [@yozafard] for IS212 Software Project Management for the client AllinOne.

## How to access our app

Our app's first release is available in [glasswindow.vercel.app](https://glasswindow.vercel.app/). It should cover the basic five functions that the client require.
To log in to our app you can use any of the staff's email with their username (in all lowercase) as their password
`e.g: email: susan.goh@allinone.com.sg, password: susan.goh`

### Local Installation

-   To use our app locally, first clone this repo to your local directory with

```bash
git clone https://github.com/vittotedja/spm-g5t3.git
```

or download our app's [source code](https://github.com/vittotedja/spm-g5t3/archive/refs/heads/master.zip)

-   Before starting our app, install all the required dependency with

```bash
npm install
```

-   To start our app you need to run two commands

```bash
npm run dev
```

and

```bash
uvicorn main:app --reload
```

### To locally test your code

Ensuring that our application is stable, testing is crucial for our development. Although CI/CD has already been implemented, here is how to test the functionalities locally.

-   To check for function

```bash
cd testing
pytest
```

-   To check for End to End functionality

```bash
py ./setup_db.py
npx cypress open
```

then run your cypress test locally and see if there are any errors
