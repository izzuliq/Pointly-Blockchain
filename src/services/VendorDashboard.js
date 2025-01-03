import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB, sql } from './db.js'; // Replace with your actual database configuration

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection failed:', err));

// Endpoint to fetch dashboard data for the vendor
app.get('/api/dashboard', async (req, res) => {
  try {
    // Query to fetch the required data for the dashboard
    const redemptionQuery = `
      SELECT COUNT(*) AS totalRedemptions
      FROM Redemptions
    `;
    const activePromotionsQuery = `
      SELECT COUNT(*) AS activePromotions
      FROM Promotions
      WHERE status = 'active'
    `;
    const revenueQuery = `
      SELECT SUM(amount) AS totalRevenue
      FROM Revenue
      WHERE status = 'completed'
    `;
    const upcomingPromotionsQuery = `
      SELECT COUNT(*) AS upcomingPromotions
      FROM Promotions
      WHERE status = 'upcoming'
    `;
    const trendsQuery = `
      SELECT MONTH(redemption_date) AS month, COUNT(*) AS redemptions
      FROM Redemptions
      GROUP BY MONTH(redemption_date)
      ORDER BY month
    `;

    const redemptionResult = await sql.query(redemptionQuery);
    const activePromotionsResult = await sql.query(activePromotionsQuery);
    const revenueResult = await sql.query(revenueQuery);
    const upcomingPromotionsResult = await sql.query(upcomingPromotionsQuery);
    const trendsResult = await sql.query(trendsQuery);

    // Prepare data for chart (Redemption Trends)
    const labels = Array.from({ length: 12 }, (_, i) => {
      return new Date(2021, i).toLocaleString('default', { month: 'short' });
    });
    const data = new Array(12).fill(0);

    trendsResult.recordset.forEach((row) => {
      data[row.month - 1] = row.redemptions;
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Redemption Trends',
          data,
          borderColor: '#4F46E5', // Purple color
          backgroundColor: 'rgba(79, 70, 229, 0.2)', // Light purple background
          fill: true, // Make the line area filled
          tension: 0.4, // Smooth line
        },
      ],
    };

    // Response object with all the data needed for the dashboard
    const response = {
      totalRedemptions: redemptionResult.recordset[0].totalRedemptions,
      activePromotions: activePromotionsResult.recordset[0].activePromotions,
      totalRevenue: revenueResult.recordset[0].totalRevenue,
      upcomingPromotions: upcomingPromotionsResult.recordset[0].upcomingPromotions,
      chartData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
