A job project that allows users to apply for jobs and manage job postings.

## Deployed Link

You can view the live project [here](https://cuvjobs.netlify.app).

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Krushna-fullstack/Cuvette
   ```

2. cd Cuvette

3. Create a .env file in the root of the project and add the following:

PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.j9rpo.mongodb.net
CORS_ORIGIN=\*
JWT_SECRET=CFYB7NIdmEIola/+h430C5LBe1pb1rhnTFlasHt7W0Y

BASE_URL=http://localhost:5000

EMAIL=<your_email@example.com>
EMAIL_PASSWORD=<your_email_password>

NODE_ENV=production

Replace <username>, <password>, <your_email@example.com>, and <your_email_password> with your actual MongoDB credentials and email details.

npm install

cd frontend
npm install

cd ../
npm run build
npm run start

Open your browser and go to http://localhost:3000 to see the app running.
