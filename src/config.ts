export const getScheme = () => {
  if (typeof window !== 'undefined') {
    return window?.location?.protocol;
  }
  return 'http';
};

export const getDomainName = () => {
  if (typeof window !== 'undefined') {
    return window?.location?.hostname;
  }
  return 'localhost';
};

export const getPort = () => {
  if (typeof window !== 'undefined') {
    return window?.location?.port;
  }
  return '';
};

export const getAuthority = () => {
  const domain = getDomainName();
  let port = getPort();
  port = port ? ':' + port : '';
  return domain + port;
};

const apiBaseUrl = import.meta?.env?.['NG_APP_BASE_URL'] || '';

export const getAPIBaseURL = () => {
  const scheme = getScheme();
  const authority = getAuthority();
  return apiBaseUrl || scheme + '//' + authority;
};

export const getBaseURL = () => {
  const scheme = getScheme();
  const authority = getAuthority();
  return scheme + '//' + authority;
};

export const Config = {
  API_URL: getAPIBaseURL() + '/api/v1',
};
