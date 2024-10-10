import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "../ChatInput/ChatInput";
import Logout from "../Logout/Logout";
import { v4 as uuidv4 } from "uuid";


function ChatContainer({ currentChat, socket }) {

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();


  useEffect(() => {
    const fetchMessagesFromLocalStorage =  () => {
      // Fetch messages from local storage
      const storedMessages = localStorage.getItem(`${currentChat._id}_messages`);
      if (storedMessages) {
        let localMessages = JSON.parse(storedMessages);

        localMessages = localMessages.map((msg) => {
          return { ...msg, id: msg.id || uuidv4() };
        });

        setMessages(localMessages);
      }      
    };

    if (currentChat) {
      fetchMessagesFromLocalStorage();
    }
  }, [currentChat]);



  const handleSendMsg = (msg) => {
    const newMessage = { fromSelf: true, message: msg, id: uuidv4() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Store the updated messages in local storage as a JSON array
    localStorage.setItem(`${currentChat._id}_messages`, JSON.stringify(updatedMessages));

    socket.current.emit("send-msg", {
      to: currentChat._id,
      msg,
    });
    
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        const newMessage = { fromSelf: false, message: msg, id: uuidv4() };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Store the received message in local storage as a JSON array
        localStorage.setItem(`${currentChat._id}_messages`, JSON.stringify(updatedMessages));
      });
    }
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket, messages]);



  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => {
          // console.log("Message ID:", message.id);
          return (
            <div ref={scrollRef} key={message.id || index}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "received"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer