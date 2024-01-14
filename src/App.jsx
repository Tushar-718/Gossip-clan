import {
  Box,
  Container,
  VStack,
  Button,
  Input,
  HStack,
  Text,
} from "@chakra-ui/react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Message from "./component/Message";
import { app } from "./component/Firebase.jsx";
import { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => signOut(auth);

function App() {
  const [user, setUser] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divForScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      divForScroll.current.scrollIntoView({behavior: "smooth"});
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <Box bg={"#2D3748"}>
      {user ? (
        <Container height={"100vh"}>
          <VStack bg={"#1A202C"} h={"full"} padding={4} borderRadius={10}>
            <Button onClick={logoutHandler} w={"full"} colorScheme={"red"}>
              Logout
            </Button>

            <VStack
              height={"full"}
              color={"white"}
              w={"full"}
              bg={""}
              overflowY={"auto"}
              marginY={2}
              css={{ "&::-webkit-scrollbar": { display: "none" } }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message"
                  color={"white"}
                />
                <Button colorScheme={"green"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <Container h={"100vh"} alignItems={"center"}>
          <VStack
            bg={"#1A202C"}
            height={"100vh"}
            borderRadius={10}
            alignItems={"center"}
            justifyContent={"center"}
            fontSize={"4xl"}
            fontWeight={"bold"}
            color={"white"}
            fontFamily={"sans-serif"}
          >
            <Text>Gossip Clan</Text>
            <Button onClick={loginHandler} colorScheme="blue">
              Sign in with Google
            </Button>
          </VStack>
        </Container>
      )}
    </Box>
  );
}

export default App;
