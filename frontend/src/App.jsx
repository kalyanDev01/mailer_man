import { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx';

function App() {
    const [emailContent, setEmailContent] = useState('');
    const [sendStatus, setSendStatus] = useState(false);
    const [emailList, setEmailList] = useState([]);

    function handleEmailContentChange(event) {
        setEmailContent(event.target.value);
    }
    function handleFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log(e);
            try {
                const data = e.target.result;
                // console.log('Data type:', typeof data, 'Data length:', data.byteLength);
                const workbook = XLSX.read(data, { type: 'binary' });
                // console.log('Workbook:', workbook);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                // console.log('Worksheet:', worksheet);
                const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
                // console.log('Email List:', emailList);
                const allEmails = emailList.map((item) =>{
                    return item.A;
                });
                setEmailList(allEmails);
            } catch (error) {
                console.error('Error in onload:', error);
            }
        }
        reader.readAsBinaryString(file);
    }
    function sendEmails() {
        setSendStatus(true);
        // Logic to send emails goes here
        axios.post('https://mailer-man-9slv.vercel.app/sendemail', { msg: emailContent, emailList: emailList })
            .then(response => {
                if(response.data === true){
                    alert('Emails sent successfully!');
                } else{
                    alert('Failed to send emails. Please try again.');
                }
                console.log('Response from backend:', response.data);
                setSendStatus(false);
            })
            .catch(error => {
                console.error('Error sending emails:', error);
                setSendStatus(false);
            });
    }
    return (
        <div>
            <div className='bg-blue-950 text-white text-center'>
                <h1 className='text-2xl p-2'>Bulk Mail</h1>
            </div>
            <div className='bg-blue-600 text-white text-center'>
                <h1 className='text-xl p-2'>We help you send emails to your contacts</h1>
            </div>

            <div>
                <h3 className='bg-blue-300 text-lg p-2 text-center'>Drag and drop</h3>
            </div>
            <div className='flex flex-col items-center px-5 py-4 bg-blue-100'>
                <textarea name="email-content" id="" className='w-[80%] border border-gray-300 p-2 text-gray-800 align-center h-32 border-black rounded-md' placeholder='Enter your email content here...' onChange={handleEmailContentChange} value={emailContent}></textarea>
                <div className='mt-4'>
                    <input type="file" onChange={handleFile} />
                </div>
                <p>Total emails: {emailList.length}</p>
                <button className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600' onClick={sendEmails}>{sendStatus ?"Sending...":"Send"}</button>
            </div>

        </div>
    )
}



export default App
