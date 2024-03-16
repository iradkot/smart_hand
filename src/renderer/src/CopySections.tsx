import React, { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { splitContent } from './utils/splitContent';
import { downloadAsTextFile } from '../../components/ui/GPTChat/utils';
import {askGPTForFileName} from "../../api/requests";


const CopySections = ({ content = "" }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const sections = splitContent(content);

  const handleDownload = async () => {
    try {
      const filename = await askGPTForFileName(content);
      downloadAsTextFile(filename, content);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <ToastContainer/>
      {sections.map((section, index) => (
        <div key={index}>
          <CopyToClipboard text={section} onCopy={() => toast.success(`Section ${index + 1} copied!`)}>
            <button>Copy</button>
          </CopyToClipboard>
          <pre>
            <code className="language-javascript">{section}</code>
          </pre>
        </div>
      ))}
      <button onClick={handleDownload}>Download as Text File</button>
    </div>
  );
};

export default CopySections;
