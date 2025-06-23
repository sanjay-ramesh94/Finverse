const res = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user?._id}`
);
const onlyInvestments = res.data.filter(tx => tx.isInvestment);
