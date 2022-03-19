import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export default function RateUser({ rating, setRating }) {
  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Rating
        name="read-only"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        controlled
        onClick={console.log(rating)}
      />
    </Box>
  );
}
