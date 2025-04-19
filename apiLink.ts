const ApiLink: { url: string } = {
    url: process.env.NODE_ENV === 'development' 
      ? "http://127.0.0.1:8000/" 
      : "https://api.privacyvet.com/",
        'http://155.138.161.14:8000/'
};

export default ApiLink;
  
