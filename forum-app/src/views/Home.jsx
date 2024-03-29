import { useEffect, useState } from "react";
import SimplePost from "../components/SimplePost/SimplePost";
import { getAllPosts } from "../services/post.service";
import { getAllUsers } from "../services/users.service";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

/**
 * Renders the Home component.
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.updateUserData - The function to update user data.
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home({ updateUserData }) {
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllPosts()])
      .then(([userCount, postSnapshot]) => {
        setTotalUsers(userCount);
        setTotalPosts(Object.keys(postSnapshot.val()).length);
        setPosts(Object.entries(postSnapshot.val()));
      })
      .catch(error => console.error(error.message));
  }, []);

  return (
    <Box className>
      <Container maxW="100%">
        <Box bgImage="https://c4.wallpaperflare.com/wallpaper/442/68/841/ayrton-senna-helmet-gloves-formula-1-mclaren-mp4-hd-wallpaper-preview.jpg"
          bgSize={'cover'}
          w={'99%'}
          bgPosition="center"
          color="white"
          textAlign="center"
          mb={'2rem'}
          py={20}>
          <Heading textAlign={'center'} mb={3} style={{
            WebkitTextStroke: '1px black',
            textStroke: '1px black',
          }}>Welcome to Team 5&apos;s Apex Assembly</Heading>
          <Heading textAlign={'center'} size={'md'} style={{
            WebkitTextStroke: '1px black',
            textStroke: '1px black',
          }}>A forum about everything Formula 1.</Heading>
        </Box>
        <Flex mb={8} mt={8}>
          <Box p={4} bgColor={"gray.300"} borderRadius="md" flex="1" mx={4}>
            <Heading textAlign={'center'} size={'md'} mb={2} color={'black'}>Total Users</Heading>
            <Text fontSize="xl" textAlign={'center'} color={'black'}>{totalUsers}</Text>
          </Box>
          <Box p={4} bgColor={"gray.300"} borderRadius="md" flex="1" mx={4}>
            <Heading textAlign={'center'} size="md" mb={2} color={'black'}>Total Posts</Heading>
            <Text fontSize="xl" textAlign={'center'} color={'black'}>{totalPosts}</Text>
          </Box>
        </Flex>
        <Flex direction={'row'} justify={'center'}>
        <Flex direction={'column'} p={4}>
            <Heading size="md" textAlign={'center'} p={4}>Newest posts</Heading>
            {posts.sort((postA, postB) => postB[1].createdOn - postA[1].createdOn)
              .slice(0, 11)
              .map(post => {
                const [postId, postData] = post
                return <SimplePost key={post} updateUserData={updateUserData} postId={postId} postData={postData} posts={posts} setPosts={setPosts} />
              })}
          </Flex>
          <Flex direction={'column'} p={4}>
            <Heading size="md" textAlign={'center'} p={4}>Most commented posts</Heading>
            {posts.filter(post => post[1].comments)
              .sort((postA, postB) => Object.keys(postB[1].comments).length - Object.keys(postA[1].comments).length)
              .slice(0, 11).map(post => {
                const [postId, postData] = post
                return <SimplePost key={post} updateUserData={updateUserData} postId={postId} postData={postData} posts={posts} setPosts={setPosts} />
              })}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

Home.propTypes = {
  updateUserData: PropTypes.func,
};