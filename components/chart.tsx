import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useQuery } from 'react-query';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useSession } from '../ctx';

const { width, height } = Dimensions.get('window');

const Chart = ({ onClose } : {onClose: any}) => {
  const { session } = useSession();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [polls, setPolls] = useState([{id: -1, title: ""}]);
  const [selectedPoll, setSelectedPoll] = useState({id: -1, title: "", startTime: "", endTime: ""}); // Default poll
  const [pollData, setPollData] = useState({totalUsers: 0, votedUsers: 0});

  const fetchAllPolls = async () => {
    const { data } = await axios.get('http://103.205.65.68:8025/api/home/polls', {
      headers: {
        "x-access-token": session['token']
      }
    });
    return data.data.polls;
  };

  const useAllPolls = () => useQuery('chartPolls', fetchAllPolls);

  const { data: pollsData, isLoading, isSuccess } = useAllPolls();

  useEffect(() => {
    if (pollsData) {
      setPolls(pollsData);
      setSelectedPoll(pollsData[0]);
    }
  }, [pollsData]);

  useEffect(() => {
    if (selectedPoll && selectedPoll['id'] && selectedPoll['id'] > 0){
      axios.get(`http://103.205.65.68:8025/api/home/chart/${selectedPoll['id']}`, {
        headers: {
          "x-access-token": session['token']
        }
      })
      .then((res) => res.data)   
      .then((res) => res.data)
      .then((res) => res.poll)
      .then(data => setPollData(data))
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Some error occured in fetching poll data',
          text2: err
        });
      })
    }
  }, [selectedPoll])

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  // Function to handle poll number selection
  const selectPoll = (pollNumber: any) => {
    setSelectedPoll(pollNumber);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const data = [
    {
      name: 'Not Voted',
      population: pollData['totalUsers'] - pollData['votedUsers'] || 0,
      color: 'red',
      legendFontColor: 'black',
      legendFontSize: 15,
    },
    {
      name: 'Voted',
      population: pollData['votedUsers'] || 0,
      color: 'green',
      legendFontColor: 'black',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* Step 1: "DATA" Text */}
        <Text style={styles.dataText}>DATA</Text>

        {/* Step 2: Poll Number and Filter Button */}
        <View style={styles.pollContainer}>
          <Text style={styles.pollText}>Poll No: {selectedPoll['id']}</Text>

          {/* Custom Funnel Filter Icon to open the dropdown */}
          <TouchableOpacity onPress={toggleDropdown} style={styles.filterButton}>
            <View style={styles.filterIcon}>
              <View style={styles.funnelBase}></View>
              <View style={styles.funnelDetail}></View>
              <View style={styles.funnelDetailTwo}></View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Custom Dropdown for selecting poll number */}
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            {polls.map((poll) => (
              <TouchableOpacity
                key={poll.id}
                style={styles.dropdownItem}
                onPress={() => selectPoll(poll)}
              >
                <Text style={styles.dropdownItemText}>{poll.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Close button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>

        {/* Heading Text */}
        <Text style={styles.headingText}>{selectedPoll['title']}</Text>

        {/* Additional Details Text */}
        <Text style={styles.detailsText}>
          Details about the chart.
        </Text>

        {/* Responsive Container for Vote Count and Pie Chart */}
        <View style={styles.chartContainer}>
          {/* Vote Count Text */}
          <View style={styles.voteCountContainer}>
            <Text style={styles.voteCountText}>Vote Count</Text>
          </View>

          {/* Pie Chart */}
          <PieChart
            data={data}
            width={width * 0.9} // Width of the chart
            height={200} // Height of the chart
            chartConfig={{
              backgroundColor: '#000000',
              backgroundGradientFrom: '#000000',
              backgroundGradientTo: '#000000',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15" // For left padding
            absolute // Whether the chart should display absolute values
          />
          <Text style={styles.detailsText1}>
            Total Users for this Poll - {pollData['totalUsers']}
          </Text>
          <Text style={styles.detailsText1}>
            {new Date(selectedPoll['startTime']).toDateString()} - {new Date(selectedPoll['endTime']).toDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  dataText: {
    position: 'absolute',
    top: '5%', // 5% from the top
    left: '50%',
    transform: [{ translateX: -50 }], // Centering horizontally
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  pollContainer: {
    position: 'absolute',
    top: '10%', // Positioning 5% below the DATA text
    left: '5%', // Align from the left
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space between items
    alignItems: 'center',
    width: '90%', // Make the container take most of the width
  },
  pollText: {
    fontSize: 18,
    color: 'white',
    marginRight: 10, // Space between Poll Text and Filter Button
  },
  filterButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  filterIcon: {
    position: 'relative',
    width: 20,
    height: 20,
  },
  funnelBase: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  funnelDetail: {
    position: 'absolute',
    top: 8,
    width: 16,
    height: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    left: 2,
  },
  funnelDetailTwo: {
    position: 'absolute',
    top: 12,
    width: 12,
    height: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    left: 4,
  },
  dropdown: {
    backgroundColor: 'white',
    position: 'absolute',
    top: '15%', // Position below the Poll No text
    left: '5%',
    width: '90%',
    borderRadius: 10,
    paddingVertical: 10,
    zIndex: 10, // Ensure the dropdown appears above other elements
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headingText: {
    position: 'absolute',
    top: '25%', // Positioning for the heading (5% gap from the top)
    left: '5%', // Align from the left
    right: '5%', // Align from the right to center the text
    color: 'red', // Red color for the heading
    fontSize: 20, // Larger font for the heading
    textAlign: 'center', // Center the heading text
    marginBottom: 5, // Spacing below the heading
    zIndex: 5, // Ensure heading text appears below the dropdown
  },
  detailsText: {
    position: 'absolute',
    top: '30%', // Positioning for the details text
    left: '5%', // Align from the left
    right: '5%', // Align from the right to center the text
    color: 'white', // White color for the details
    fontSize: 16, // Font size for the details text
    textAlign: 'center', // Center the details text
    zIndex: 4, // Ensure details text appears below the heading
  },
  detailsText1: {
    position: 'relative',
    // top: '80%', // Positioning for the details text
    left: '5%', // Align from the left
    right: '5%', // Align from the right to center the text
    color: 'black', // White color for the details
    fontSize: 12, // Font size for the details text
    textAlign: 'center', // Center the details text
    zIndex: 4, // Ensure details text appears below the heading
  },
  chartContainer: {
    position: 'absolute',
    top: '42%', // Positioning for the chart container
    left: '5%',
    right: '5%',
    padding: '3%', // Padding of 3% from all sides
    backgroundColor: '#f9f1f0', // Light blue background
    borderRadius: 10, // Rounded corners
    alignItems: 'center', // Center items inside
  },
  voteCountContainer: {
    alignItems: 'center', // Center the text horizontally
  },
  voteCountText: {
    fontSize: 20,
    color: 'black', // Black color for the vote count text for better contrast
    fontWeight: 'bold',
  },
});

export default Chart;
