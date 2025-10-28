import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const setStringToLength = (input: string, length: number) => {
  if (input.length < length) return input;
  return input.slice(0, length - 2) + "...";
}

interface UpcomingProps {
  modalVisible: any; // Change to any
  setModalVisible: (value: any) => void; // Still any for setter
  data: any;
}

const Upcoming: React.FC<UpcomingProps> = ({ modalVisible, setModalVisible, data }) => {
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal} // Handle Android back button
    >
      <View style={styles.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          {/* Upcoming Poll Title */}
          <Text style={styles.pollTitle}>Upcoming Poll</Text>
          
          {data.map(poll => {
            return (
              <View style={styles.cardView} key={poll.id}>
                <Text style={styles.loremText}>
                  {setStringToLength(poll.title, 50)}
                </Text>

                {/* Card with Winner Information */}
                <View style={styles.card}>
                  <Text style={styles.winnerHeading}>Date</Text>
                  <Text style={styles.winnerText}>{new Date(poll.startTime).toDateString()}</Text>
                </View>
              </View>
            )            
          })}
          {/* Lorem Ipsum Text */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.80)', // Transparent black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    width: '90%',
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center', // Align items to the center
  },
  pollTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4caf50', // Green color for the title
    textAlign: 'center', // Center align text
    marginBottom: 10, // Adjust spacing below title
    marginTop: 10, // Add spacing above title
  },
  loremText: {
    fontSize: 16,
    color: '#ccc', // Grey color for the lorem text
    textAlign: 'center', // Center align text
    marginBottom: 20, // Spacing below lorem text
  },
  cardView: {
    width: "100%",
    marginTop: 20
  },
  card: {
    width: '100%', // Full width of the container
    height: 80, // Adjust height as needed
    borderRadius: 26,
    justifyContent: 'center', // Center contents
    alignItems: 'center', // Align items to the center
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
  },
  winnerHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Black color for winner heading
    textAlign: 'center', // Center align text
  },
  winnerText: {
    fontSize: 16,
    color: '#ffa500', // Orange color for the winner text
    textAlign: 'center', // Center align text
  },
});

export default Upcoming;
