
export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value?.toString() || '';
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDataForExport(data: any[], type: 'patients' | 'doctors' | 'drugs' | 'appointments') {
  return data.map(item => {
    switch (type) {
      case 'patients':
        return {
          ID: item.id,
          Name: `${item.firstName} ${item.lastName}`,
          Email: item.email,
          Phone: item.phone,
          'Date of Birth': item.dateOfBirth,
          Gender: item.gender,
          'Created At': new Date(item.createdAt).toLocaleDateString()
        };
      case 'doctors':
        return {
          ID: item.id,
          Name: `Dr. ${item.firstName} ${item.lastName}`,
          Email: item.email,
          Phone: item.phone,
          Specialization: item.specialization,
          Experience: `${item.experience} years`,
          Rating: item.rating,
          'Consultation Fee': item.consultationFee,
          Active: item.isActive ? 'Yes' : 'No'
        };
      case 'drugs':
        return {
          ID: item.id,
          Name: item.name,
          Category: item.category,
          Manufacturer: item.manufacturer,
          'Stock Quantity': item.stockQuantity,
          'Unit Price': item.unitPrice,
          'Expiry Date': item.expiryDate,
          'Batch Number': item.batchNumber
        };
      case 'appointments':
        return {
          ID: item.id,
          Patient: item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : '',
          Doctor: item.doctor ? `Dr. ${item.doctor.firstName} ${item.doctor.lastName}` : '',
          Date: item.appointmentDate,
          Time: item.appointmentTime,
          Status: item.status,
          Reason: item.reason
        };
      default:
        return item;
    }
  });
}
