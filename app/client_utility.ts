'use-client'

export function setCookies(cookiesToSet : { [key: string]: string }) {
  for (const [key, value] of Object.entries(cookiesToSet)) {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=86400; Secure`;
  }
}

export function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
  
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
        console.log("c:", c);
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function deleteCookie(cname: string) {
  document.cookie = `${encodeURIComponent(cname)}=; path=/; max-age=0; Secure`;
}