export default function request(url, options) {

  const token = getAuthToken();

  let authToken = {};

  let ActionURl = url;

  if (token !== undefined) {
    authToken = {
      headers: {
        Token: token == null ? '' : token,
        Data: new Date().getTime(),
        Sys: 0,
      },
    };
  }

  const defaultOptions = {
    credentials: 'include',
    ...authToken,
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  if (newOptions.method === 'GET') {
    newOptions.headers = {
      'Accept': 'application/json',
    };
  }

  if (newOptions.method === 'GET') {
    newOptions.headers = {
      'Accept': 'application/json',
    };
  }


  /**
   * 开发-生产版本切换管理
   */
  if (Environment == 'test' && ActionURl.indexOf('/test') !== 0) {
    ActionURl = '/test/ams' + ActionURl;
  } else {
    /**
     * 增加统一权限开关
     */
    if (getAuthentication()) {
      ActionURl = '/ams' + ActionURl;
    }
  }


  return fetch(ActionURl, newOptions)
    .then((response) => {
      return response.json();
    })
    .then((response) => {

      //业务型异常解析
      let IndividualityStatus;  //个性状态
      if (!(response.status === undefined) ) {
        IndividualityStatus = response.status.toString().length == 8 ? true : false;
      }

      if (response.status === undefined || response.status === 200 || response.status === 304||IndividualityStatus ) {
        return { response };
      } else {
        let errorText = codeMessage[response.status] || response.statusText;
        //全局错误提醒
        if (getEnvironment() == 'test') {
          notification.error({
            message: `调用服务端请求失败： ${response.status}: ${response.url}---${response.statusText}`,
            description: errorText,
          });
        }
        const error = new Error(errorText);
        error.response = response;
        throw error;

      }
    })
    .catch(error => {
      throw { error };
    });
}