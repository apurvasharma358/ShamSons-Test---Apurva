import express from 'express'
import 'dotenv/config';
import cors from 'cors';
import { clerkMiddleware, createClerkClient, getAuth } from '@clerk/express'
import { Resend } from 'resend';

const app = express()
const PORT = process.env.PORT || 3000

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(clerkMiddleware())
app.use(express.json());

// Use `getAuth()` to protect this route
app.get('/protected', async (req, res) => {
    try {
        // Use `getAuth()` to get the user's `userId` and authentication status
        const { isAuthenticated, userId } = getAuth(req)

        // If user isn't authenticated, return a 401 error
        if (!isAuthenticated) {
            res.status(401).json({ error: 'User not authenticated' })
            return
        }

        const user = await clerkClient.users.getUser(userId)

        console.log(`User ${userId} is authenticated.`);

        // const userEmail = user.emailAddresses[0]?.emailAddress || 'No Email';
        // if (userEmail) {
        //     // We use 'onboarding@resend.dev' for testing mode. 
        //     // Note: On unverified Resend domains, you can only send emails to yourself!
        //     resend.emails.send({
        //         from: 'onboarding@resend.dev',
        //         // to: userEmail, // Sends to your authenticated Clerk test email
        //         to: 'apurvasharma358@gmail.com', // Sends to your authenticated Clerk test email
        //         subject: 'Security Alert: New Successful Login Detected',
        //         html: `
        //             <h1>Hello ${user.firstName || 'User'},</h1>
        //             <p>We detected a new successful login to your account workspace workspace portal.</p>
        //             <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        //             <p>If this wasn't you, please secure your security credentials immediately.</p>
        //         `
        //     }).catch(emailErr => console.error("Resend delivery failed:", emailErr));
        // }

        res.json({
            message: "Backend processed successfully",
            userId: userId,
            email: user.emailAddresses[0]?.emailAddress || 'No Email',
            firstName: user.firstName
        });
        // res.json({ user })
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})