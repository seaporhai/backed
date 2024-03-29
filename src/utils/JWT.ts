import bcrypt from "bcrypt";

const plaintextPassword = 'your_password_here';
const saltRounds = 10;

const hashPassword = (plaintextPassword : any , saltRounds: any ) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(hashedPassword);
        });
    });
};

export default hashPassword;
