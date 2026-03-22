<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Cruda. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` client-side before React hydration, with exception capture enabled and a reverse-proxy via `/ingest` rewrites.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client singleton using `posthog-node` for API route tracking.
- **`next.config.ts`**: Added `/ingest` rewrites to proxy PostHog requests through the app (improves ad-blocker resilience) and `skipTrailingSlashRedirect: true`.
- **`app/login/page.tsx`**: Calls `posthog.identify(email)` and captures `user_signed_in` on successful login.
- **`app/register/page.tsx`**: Calls `posthog.identify(email, { name, username })` and captures `user_signed_up` on successful registration.
- **`app/upload/page.tsx`**: Captures `photo_upload_started` with a `photo_count` property when the user initiates an upload.
- **`components/photo-bar.tsx`**: Captures `photo_saved` or `photo_unsaved` (based on toggle result) and `photo_deleted` on confirmed deletion.
- **`components/profile-bar.tsx`**: Captures `user_followed` or `user_unfollowed` (based on toggle result) with `followed_user_id` and `followed_username` properties.
- **`app/api/photos/route.ts`**: Server-side `photo_created` event after a new photo record is persisted to the database.
- **`app/api/photos/[id]/route.ts`**: Server-side `photo_metadata_updated` event after a photo's title/description is patched.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logged in | `app/login/page.tsx` |
| `user_signed_up` | User successfully created a new account | `app/register/page.tsx` |
| `photo_upload_started` | User initiated upload (includes `photo_count`) | `app/upload/page.tsx` |
| `photo_saved` | User saved a photo to their collection | `components/photo-bar.tsx` |
| `photo_unsaved` | User removed a photo from saved collection | `components/photo-bar.tsx` |
| `user_followed` | User followed another user | `components/profile-bar.tsx` |
| `user_unfollowed` | User unfollowed another user | `components/profile-bar.tsx` |
| `photo_deleted` | User confirmed deletion of their photo | `components/photo-bar.tsx` |
| `photo_created` | Server: new photo persisted to database | `app/api/photos/route.ts` |
| `photo_metadata_updated` | Server: photo title/description updated | `app/api/photos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/241563/dashboard/1386714)
- **Insight**: [User Sign-ins & Sign-ups](https://us.posthog.com/project/241563/insights/z8jsJP2k)
- **Insight**: [Signup to First Photo Funnel](https://us.posthog.com/project/241563/insights/C5sIkQQc)
- **Insight**: [Engagement Actions (Saves & Follows)](https://us.posthog.com/project/241563/insights/X8L8PIFS)
- **Insight**: [Photos Created Per Day](https://us.posthog.com/project/241563/insights/dReQfMkv)
- **Insight**: [Upload Completion Rate](https://us.posthog.com/project/241563/insights/bBgqaqfW)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
