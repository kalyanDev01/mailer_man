const fileinput = document.getElementById('fileInput');
if (!fileinput) {
    console.error('File input element not found');
} else {
    fileinput.addEventListener('change', (event) => {
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
                const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A'});
                console.log('Email List:', emailList);
            } catch (error) {
                console.error('Error in onload:', error);
            }
        }
        reader.readAsBinaryString(file);
        
    });
}