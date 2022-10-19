import dotenv from "dotenv";
dotenv.config();
const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_1,
  process.env.MAILJET_2
);

export default function mailer(email, name, pseudo) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "victor.boyer@efrei.net",
          Name: "EQUIPE SNOOPCHAT",
        },
        To: [
          {
            Email: email,
            Name: pseudo,
          },
        ],
        Subject: "Nouvelle utilisateur !",
        TextPart: "Rookie",
        HTMLPart: ` <h3>Bienvenue sur Rookie ${name} !</h3><br />Si vous n'avez pas créer de compte récemment, veuillez nous contacter. </br> L'équipe Rookie`,
        CustomID: "registerEmail",
      },
    ],
  });
  return request;
}
