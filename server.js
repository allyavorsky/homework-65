require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Неправильний email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Неправильний пароль." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .send("Будь ласка, увійдіть, щоб отримати доступ до цього ресурсу");
}

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("Користувач з таким email вже існує");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("Нового користувача збережено в БД:", newUser);
    res.status(201).send("Користувача успішно зареєстровано");
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    res.status(500).send("Помилка на сервері");
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(`Ласкаво просимо, ${req.user.email}!`);
});

app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send("Ви успішно вийшли з системи");
  });
});

app.get("/protected", ensureAuthenticated, (req, res) => {
  res.send(
    `Привіт, ${req.user.email}! Це секретна інформація, доступна тільки для тебе.`
  );
});

app.get("/api/users", ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}, "email");
    res.json(users);
  } catch (error) {
    res.status(500).send("Помилка на сервері");
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Сервер Express. Захищений маршрут створено.</h1>");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB підключено успішно!");
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
