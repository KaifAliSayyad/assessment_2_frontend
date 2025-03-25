import axios from 'axios';

async function buyStock(stock, quantity, id) {
    const response = await axios.post(`http://localhost:9999/trading/buy/${id}`, {
        stockId : stock?.id,
        quantity : quantity
    });
};

export default buyStock;