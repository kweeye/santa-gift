"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
let pendingRequests = [];
function fetchUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        const userResponse = yield (0, node_fetch_1.default)('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json');
        const profileResponse = yield (0, node_fetch_1.default)('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json');
        const users = yield userResponse.json();
        const profiles = yield profileResponse.json();
        return { users, profiles };
    });
}
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, message } = req.body;
    const { users, profiles } = yield fetchUserData();
    const user = users.find(u => u.uid === userId);
    if (!user) {
        return res.status(400).send('User not found');
    }
    const profile = profiles.find(p => p.userUid === user.uid);
    if (!profile) {
        return res.status(400).send('Profile not found');
    }
    console.log(profile);
    const age = calculateAge(new Date(profile.birthdate));
    if (age >= 10) {
        return res.status(400).send('User is older than 10 years');
    }
    console.log(user.username);
    console.log(profile.address);
    console.log(message);
    pendingRequests.push({ username: user.username, address: profile.address, message });
    res.send('Request received');
}));
function calculateAge(dob) {
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
}
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (pendingRequests.length === 0)
        return;
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'merle68@ethereal.email',
            pass: 'y8AZYp6rx2VeS8xvTp'
        }
    });
    const mailOptions = {
        from: 'do_not_reply@northpole.com',
        to: 'santa@northpole.com',
        subject: 'Pending Requests',
        text: JSON.stringify(pendingRequests, null, 2)
    };
    yield transporter.sendMail(mailOptions);
    pendingRequests = [];
}), 15000);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
