import { useLayoutEffect } from 'react';

const useDocumentSeo = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'DeranMore';
    }
  }, [title]);
};

export default useDocumentSeo;
