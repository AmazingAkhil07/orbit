declare module 'react-csv' {
  import React from 'react';
  
  interface CSVLinkProps {
    data: any[];
    filename?: string;
    headers?: any[];
    target?: string;
    [key: string]: any;
  }
  
  export const CSVLink: React.FC<CSVLinkProps>;
  export default CSVLink;
}
