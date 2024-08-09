import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { splitContent } from './utils/splitContent';
import { downloadAsTextFile } from '../../components/ui/GPTChat/utils';
import { askGPTForFileName } from "../../api/requests";
import { useCopyHistory } from './contexts/CopyHistoryContext';

const CopySections = ({ content = "" }) => {
  const { copyToClipboardWithToast } = useCopyHistory();

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
      <ToastContainer />
      {sections.map((section, index) => (
        <div key={index}>
          <button onClick={() => copyToClipboardWithToast(section, index)}>Copy</button>
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
