import './App.css';
import {Container, Typography} from "@material-ui/core";
import Order from "./components/Order";

function App() {
  return (
    <Container maxWidth={'md'}>
      <Typography
        variant={'h2'}
        align={'center'}>
        Point-of-Sale App
      </Typography>
        <Order />
    </Container>
  );
}

export default App;
