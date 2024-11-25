import React , { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import { router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useQuery } from 'react-query';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Ongoing from '../../../components/ongoing'; // Adjust the import path of your modal component
import Upcoming from '../../../components/upcoming'; // Import Upcoming modal component
import Previous from '../../../components/previous';
import Chart from '../../../components/chart'; // Import Chart component
import { useSession } from '../../../ctx';

const { width, height } = Dimensions.get('window'); // For responsiveness

const UserDashboard = () => {
  const { session } = useSession();
  SplashScreen.preventAutoHideAsync();
  const [ongoingModalVisible, setOngoingModalVisible] = useState(false); // State for ongoing modal
  const [upcomingModalVisible, setUpcomingModalVisible] = useState(false); // State for upcoming modal
  const [previousModalVisible, setPreviousModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchHomePolls = async () => {
    const { data } = await axios.get('http://103.205.65.68:8025/api/home', {
      headers: {
        "x-access-token": session['token']
      }
    });
    return data;
  };

  const useHome = () => useQuery('home', fetchHomePolls);

  const { data, isLoading, isSuccess } = useHome();


  useEffect(() => {
    if (!isSuccess) {
      SplashScreen.hideAsync();
    }
  }, [isSuccess]);

  if (!isSuccess) {
    return null;
  }

  return (
    <View style={styles.outerContainer}>
      {/* Step 1: Activity Log Text */}
      <Text style={styles.activityLogText}>Activity Log</Text>

      {/* Step 2: Responsive Container with Two Cards */}
      {/* <View style={styles.container}>
        <Text style={styles.createText}>Create</Text>
        <View style={styles.smallCardsContainer}>
 
          <TouchableOpacity style={styles.smallCard} onPress={() => {
            router.push("/(admintabs)/createuser")
          }}>
            <Text style={styles.smallCardText}>Users</Text>
            <Image 
              source={require('../../Resources /user.png')}
              style={styles.cardImage} 
            />
          </TouchableOpacity>

        
          <TouchableOpacity style={styles.smallCard} onPress={() => {
            router.push("/(admintabs)/createPoll")
          }}>
            <Text style={styles.smallCardText}>Polls</Text>
            <Image 
              source={require('../../Resources /poll.png')}
              style={styles.cardImage} 
            />
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Center Container */}
      <View style={styles.centerContainer}>
        <Text style={styles.recentPollsText}>Recent Polls</Text>

        {/* Ongoing Poll Card on the Left */}
        <TouchableOpacity style={styles.largeCard} onPress={() => {
            if (data.data.data.ongoingPolls.length) setOngoingModalVisible(true);
            else Toast.show({
              type: 'error',
              text1: 'No Ongoing Poll',
              text2: 'No Ongoing Poll Available👋'
            });
          }}>
          <View style={styles.cardContent}>
            <Text style={styles.largeCardText}>Ongoing Poll</Text>
            <Text style={styles.voteText}>Vote here</Text>
          </View>
          <Image
            source={require('../../Resources /voting-box.png')}
            style={styles.largeCardImage}
          />
        </TouchableOpacity>
        <View style={styles.rightCardsContainer}>
          {/* Upcoming Polls Card */}
          <TouchableOpacity style={styles.rightCard} onPress={() => {
            if (data.data.data.upcomingPolls.length) setUpcomingModalVisible(true);
            else Toast.show({
              type: 'error',
              text1: 'No Upcoming Poll',
              text2: 'No Upcoming Poll Available👋'
            });
          }}>
            <View style={styles.cardContent}>
              <Text style={styles.rightCardText}>Upcoming Polls</Text>
            </View>
            <Image
              source={require('../../Resources /arrow.png')}
              style={styles.largeCardImage1}
            />
          </TouchableOpacity>

          {/* Previous Polls Card */}
          <TouchableOpacity style={styles.rightCard} onPress={() => {
            if (data.data.data.previousPolls.length) setPreviousModalVisible(true);
            else Toast.show({
              type: 'error',
              text1: 'No Previous Poll',
              text2: 'No Previous Poll Available👋'
            });
          }}>
            <View style={styles.cardContent}>
              <Text style={styles.rightCardText}>Previous Polls</Text>
            </View>
            <Image
              source={require('../../Resources /arrow.png')}
              style={styles.largeCardImage1}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Polls Container */}
      <View style={styles.totalPollsContainer}>
        <Text style={styles.totalPollsText}>Total No of Voted Polls </Text>
        <Text style={styles.totalPollsCount}>{data.data.data.totalPolls} Votes </Text>
            
      </View>


  
      {/* Ongoing Poll Modal */}
      {ongoingModalVisible && (
        <Ongoing data={data.data.data.ongoingPolls[0]} modalVisible={ongoingModalVisible} setModalVisible={setOngoingModalVisible} />
      )}
      {/* Upcoming Poll Modal */}
      {upcomingModalVisible && (
        <Upcoming data={data.data.data.upcomingPolls} modalVisible={upcomingModalVisible} setModalVisible={setUpcomingModalVisible} />
      )}
      {/* Previous Poll Modal */}
      {previousModalVisible && (
        <Previous data={data.data.data.previousPolls} modalVisible={previousModalVisible} setModalVisible={setPreviousModalVisible} />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  activityLogText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.05, // 5% from the top
  },
  container: {
    backgroundColor: '#e7f2f8',
    width: '98%',
    padding: '5%',
    borderRadius: 20,
    marginTop: height * 0.03, // Spacing between Activity Log and the container
  },
  createText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10, // Space between "Create" and the cards
  },
  recentPollsText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10, // Space between "Recent Polls" and the top of the container
    position: 'absolute', // Absolute positioning to place at the top left
    top: 10, // Adjust as needed
    left: 10, // Adjust as needed
  },
  smallCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    backgroundColor: '#145da0',
    width: '45%', // Responsive width for each card
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row', // Align items horizontally
    paddingHorizontal: 15,
  },
  smallCardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardImage: {
    width: 40,
    height: 40, // Adjust the size based on the image resolution
    resizeMode: 'contain',
  },

  // Center Container styles
  centerContainer: {
    backgroundColor: '#e7f2f8', // Pink color for the center container
    width: '98%',
    marginTop: height * 0.02, // Slightly less gap from the top
    flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-between',
    padding: '3%',
    borderRadius: 20,
    position: 'relative', // Enable absolute positioning for the text
    paddingTop: 50, // Add padding to create space for the Recent Polls text
  },
  
  largeCard: {
    backgroundColor: '#145da0', // Blue background for the Ongoing Poll card
    width: '48%', // Large card takes almost half width
    height: 200, // Double the height of the small cards
    flexDirection: 'row', // Align text and image horizontally
    justifyContent: 'space-between', // Space between text and image
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    position: 'relative', // Enable absolute positioning for the image
  },
  cardContent: {
    width: '70%', // Give space for text on the left side
  },
  largeCardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voteText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 5,
  },

  largeCardImage: {
    position: 'absolute', // Position the image at the bottom-right corner
    bottom: 10,
    right: 10,
    width: 50,
    height: 50, // Adjust the size based on your image
    resizeMode: 'contain',
  },
  largeCardImage1: {
    width: 36,
    height: 36, // Adjust the size based on your image
    resizeMode: 'contain',
  },
  rightCardsContainer: {
    width: '48%', // Right cards container takes the other half width
    justifyContent: 'space-between', // Space between the two cards
  },
  rightCard: {
    backgroundColor: 'black', // Black background for Upcoming and Previous Polls
    height: 95, // Half of the large card height
    flexDirection: 'row', // Align text and image horizontally
    justifyContent: 'space-between', // Space between text and image
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
  },
  rightCardText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  
  // New Styles for Total Polls Container
  totalPollsContainer: {
    backgroundColor: 'black', // Black background color
    width: '98%',
    height: height * 0.2, // 20% of the screen height
    borderRadius: 20,
    padding: 20,
    marginTop: height * 0.02, // 5% gap from center container
    alignItems: 'center', // Align items to the left
    justifyContent: 'center', // Center content vertically
  },
  totalPollsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPollsCount: {
    color: 'white',
    fontSize: 16,
    marginTop: 5, // Space between lines
  },
  
  // Styles for View Data Button
  viewDataButton: {
    backgroundColor: 'green', // Red background for the button
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20, // Space above the button
    width: '80%', // Set width to 80% of the total container width
    alignSelf: 'center', // Center the button within the container
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 60, // Space between icon and text
  },
  buttonIcon: {
    width: 24,
    height: 24, // Size of the icon
    resizeMode: 'contain',
  },
});

export default UserDashboard;