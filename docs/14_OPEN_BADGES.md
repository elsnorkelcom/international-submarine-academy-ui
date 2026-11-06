# ISA · Open Badges 3.0

Reference: [1EdTech Open Badges Specification v3.0](https://www.imsglobal.org/spec/ob/v3p0) (final release, document version 1.4.5).

Open Badges 3.0 is no longer a badge image with metadata: it is a **Verifiable Credential** per the W3C Verifiable Credentials Data Model 2.0. Being compatible means being signable and verifiable, not only "shaped like" the JSON.

---

## 1. What the specification requires

| Element | Requirement |
|---|---|
| Document | `@context` with the VC v2 context plus the OB 3.0 context; types `VerifiableCredential` + `OpenBadgeCredential` |
| Issuer | A `Profile` with a stable `id` URL and `name`; the issuer is the authority for the claim |
| Achievement | `Achievement` with `id`, `name`, `criteria`; optional `alignment`, `result`, `image`, `tag` |
| Subject | `AchievementSubject`; in practice a recipient identifier (email address, DID or similar) |
| Proof | `proof` (Data Integrity / Linked Data Proof) or the JWT proof format; without it the document is not a verifiable credential |
| Status | Optional but expected in production: `credentialStatus` pointing to a status list for revocation |
| Hosting | Stable resolvable URLs for issuer profile, achievements and status list |

## 2. How ISA maps today

| OB concept | ISA source | State |
|---|---|---|
| Issuer `Profile` | Museum / institution (`Museums`, `Institutions`) | Mapped, unsigned |
| `Achievement` | `Badge` (name, description, criteria, type, season, mission) | Mapped |
| `Alignment` | `Mission.gsaCompetency`, `Mission.timssDomain` | Mapped |
| `AchievementSubject` | Learner progress record | **No subject identifier** — decision pending |
| `proof` | — | **Missing** (needs an issuer service) |
| `credentialStatus` | — | **Missing** (needs a status list service) |

## 2.1 Award rules

| Rule | Trigger | Fields on `Badge` |
|---|---|---|
| `mission` | Completing the linked mission | `missionId` |
| `season-count` | Completing N missions of the season (end of season) | `seasonId`, `ruleCount` |

`lib/badges/rules.ts` evaluates every published badge after a correct answer.
Awards are additive: a failure in the awarding path never blocks the mission
result, and re-evaluating never duplicates a credential.

## 2.2 Credential registry

`lib/badges/registry.ts` stores every award as a `CredentialRecord`:

| Field | Meaning |
|---|---|
| `registryNo` | `ISA-2026-0001` style sequence |
| `document` | Full Open Badge 3.0 document (unsigned) |
| `credentialStatus` | `issued` or `revoked` |
| `proofStatus` | `unsigned` until an issuer signs it |
| `subject` | `anonymous`: ISA stores no personal data |

The registry survives reloads in IndexedDB, is exportable per credential, and is
the object a future signing service would consume without rewriting the award
logic.

## 3. Implemented now (phase 1)

`lib/badges/openbadge.ts` builds an OB-shaped document from the local record:

- `buildIssuer`, `buildAchievement`, `buildUnsignedCredential`;
- `checkUnsignedCredential` reports structural problems and always flags the
  missing proof;
- the profile exposes an **OB 3.0** button that downloads
  `<badge-id>.openbadge.json` and warns that the file is unsigned.

This is deliberately **not** called a certification: exporting the file does not
make it verifiable.

## 4. What is still needed for real conformance (phase 2)

1. **Issuer service** with a key pair (Ed25519 Multikey or RS256 JWT) and a
   publicly resolvable issuer profile.
2. **Achievement hosting**: each achievement id must resolve to its definition.
3. **Signing**: VC-JWT or Data Integrity proof over the credential.
4. **Status list** (BitstringStatusList or equivalent) to revoke credentials.
5. **Recipient identity**: OB requires a subject identifier. ISA currently
   collects no personal data, so this is a product and privacy decision:
   - email address (simple, requires consent and storage),
   - DID/self-sovereign wallet (no personal data, more complexity),
   - pseudonymous per-device identifier (limited portability).

Technical constraint: Google Apps Script cannot produce Ed25519 or RS256
signatures reliably, so a real issuer must be a small Node service (Cloudflare
Worker, serverless function or similar). The static app keeps working without it.

## 4.1 Registry verification

Node run over `MemoryStorage` with a synthetic end-of-season badge:

```text
AWARDED [ 'BDG-EXPEDITION-CREDENTIAL', 'BDG-CF4D24F7' ]
REGISTRY [
  { no: 'ISA-2026-0002', badge: 'BDG-CF4D24F7', status: 'issued', proof: 'unsigned' },
  { no: 'ISA-2026-0001', badge: 'BDG-EXPEDITION-CREDENTIAL', status: 'issued', proof: 'unsigned' }
]
```

- re-evaluating the same mission issues nothing new;
- raising the threshold to 5 blocks the season badge;
- every document has `type: [VerifiableCredential, OpenBadgeCredential]`, a
  stable `id` and no `proof`.

## 5. Verification performed

- `tsc --noEmit` clean; builder compiled and executed in Node:

```json
{
  "@context": ["https://www.w3.org/ns/credentials/v2", "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"],
  "type": ["VerifiableCredential", "OpenBadgeCredential"],
  "issuer": "https://academy.elsnorkel.com/issuer",
  "achievement": "https://academy.elsnorkel.com/achievements/steel/bdg-expedition-credential"
}
```

- `checkUnsignedCredential` returns exactly one problem:
  `Unsigned: no proof, so the credential is not verifiable.`

## 6. Limits

- The exported document is not signed, hosted or registered anywhere.
- Alignment targets are names only; a real alignment needs stable framework URLs.
- The issuer profile URL is derived from the site origin and does not serve a
  profile document yet.
- No revocation, no expiry, no recipient identification.
