const JWKS_URL='https://token.actions.githubusercontent.com/.well-known/jwks';
export const DEFAULT_EXPECTED=Object.freeze({
  issuer:'https://token.actions.githubusercontent.com',
  audience:'aimos-public-sales-evidence',
  repository:'hukuyama1027-ai/public-sales-decision-os-lp',
  ref:'refs/heads/main',
  workflow_ref:'hukuyama1027-ai/public-sales-decision-os-lp/.github/workflows/evidence-export.yml@refs/heads/main'
});
let jwksCache=null, jwksCachedAt=0;
function b64urlBytes(input){const normalized=input.replace(/-/g,'+').replace(/_/g,'/');const padded=normalized+'='.repeat((4-normalized.length%4)%4);const raw=atob(padded);return Uint8Array.from(raw,c=>c.charCodeAt(0));}
function b64urlJson(input){return JSON.parse(new TextDecoder().decode(b64urlBytes(input)));}
export function parseJwt(token){if(typeof token!=='string')throw new Error('OIDC_MALFORMED');const parts=token.split('.');if(parts.length!==3)throw new Error('OIDC_MALFORMED');let header,payload;try{header=b64urlJson(parts[0]);payload=b64urlJson(parts[1]);}catch{throw new Error('OIDC_MALFORMED');}return{parts,header,payload,signature:b64urlBytes(parts[2])};}
function audienceMatches(aud,expected){return Array.isArray(aud)?aud.includes(expected):aud===expected;}
export function validateClaims(payload,expected=DEFAULT_EXPECTED,nowSeconds=Math.floor(Date.now()/1000)){const skew=60;if(payload.iss!==expected.issuer)throw new Error('OIDC_ISSUER');if(!audienceMatches(payload.aud,expected.audience))throw new Error('OIDC_AUDIENCE');if(payload.repository!==expected.repository)throw new Error('OIDC_REPOSITORY');if(payload.ref!==expected.ref)throw new Error('OIDC_REF');if(payload.workflow_ref!==expected.workflow_ref)throw new Error('OIDC_WORKFLOW');if(!Number.isFinite(Number(payload.exp))||Number(payload.exp)<nowSeconds-skew)throw new Error('OIDC_EXPIRED');if(payload.nbf!=null&&Number(payload.nbf)>nowSeconds+skew)throw new Error('OIDC_NOT_YET_VALID');if(payload.iat!=null&&Number(payload.iat)>nowSeconds+skew)throw new Error('OIDC_IAT');return true;}
async function getJwks(fetchImpl=fetch){if(jwksCache&&Date.now()-jwksCachedAt<3600000)return jwksCache;const r=await fetchImpl(JWKS_URL,{headers:{accept:'application/json'}});if(!r.ok)throw new Error('JWKS_UNAVAILABLE');const body=await r.json();if(!Array.isArray(body.keys))throw new Error('JWKS_UNAVAILABLE');jwksCache=body;jwksCachedAt=Date.now();return body;}
export async function verifyGitHubOidc(token,{fetchImpl=fetch,jwks=null,expected=DEFAULT_EXPECTED,nowSeconds=Math.floor(Date.now()/1000)}={}){const parsed=parseJwt(token);if(parsed.header.alg!=='RS256'||!parsed.header.kid)throw new Error('OIDC_ALG');const keys=jwks||await getJwks(fetchImpl);const jwk=(keys.keys||[]).find(k=>k.kid===parsed.header.kid&&k.kty==='RSA');if(!jwk)throw new Error('OIDC_KID');let key;try{key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);}catch{throw new Error('OIDC_KEY');}const data=new TextEncoder().encode(`${parsed.parts[0]}.${parsed.parts[1]}`);const ok=await crypto.subtle.verify({name:'RSASSA-PKCS1-v1_5'},key,parsed.signature,data);if(!ok)throw new Error('OIDC_SIGNATURE');validateClaims(parsed.payload,expected,nowSeconds);return parsed.payload;}
export function bearerToken(request){const h=request.headers.get('authorization')||'';const m=h.match(/^Bearer\s+([^\s]+)$/i);return m?m[1]:null;}
export const __test={JWKS_URL,b64urlBytes,audienceMatches};
