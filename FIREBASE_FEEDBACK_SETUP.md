# Central tool ratings: Firebase setup

The feedback UI uses Firebase Anonymous Authentication plus Cloud Firestore. Visitors can submit/update one rating per tool using a persistent anonymous browser identity. Community ratings are readable to all visitors; optional notes are stored separately and readable only by the same anonymous identity.

## Required Firebase Console steps

1. Confirm the Firebase project is `qantaratools-255da`.
2. Authentication → Sign-in method → enable **Anonymous**.
3. Create/enable **Cloud Firestore** in production mode.
4. Deploy the supplied rules from the project root:

   ```bash
   firebase deploy --only firestore:rules
   ```

5. Restrict the Firebase web API key to the production domain and your development domains under Google Cloud API key restrictions.
6. Before public launch, enable Firebase App Check for Authentication and Firestore to reduce automated submissions. The ratings are not protected by a CAPTCHA until App Check is configured/enforced.

## Data layout

- `toolFeedback/{toolId}/ratings/{anonymousUid}`: integer rating (1–5) and update time. Ratings are public-read so the interface can calculate a community average. A browser identity can update only its own vote.
- `toolFeedback/{toolId}/notes/{anonymousUid}`: optional note, max 500 characters. Readable only by the same anonymous UID; never shown publicly by the UI.

No Firebase Admin/service-account credential is used in browser code. The Firebase web config/API key is a client identifier; authorization relies on Firestore rules.
