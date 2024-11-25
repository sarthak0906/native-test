import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useSession } from '../ctx';
import ReactNativeBiometrics from 'react-native-biometrics'; // Import biometrics

interface OngoingProps {
  modalVisible: any; 
  setModalVisible: (value: any) => void;
  data: any;
}

const Ongoing: React.FC<OngoingProps> = ({ modalVisible, setModalVisible, data }) => {
  const { session } = useSession();
  const closeModal = () => {
    setModalVisible(false);
  };

  const [nominieeId, setnominieeId] = useState();

  const handleVoteSubmit = () => {
    const biometrics = new ReactNativeBiometrics();

    // Check if biometrics is supported
    biometrics.isSensorAvailable()
      .then((result) => {
        const { available, biometryType } = result;

        if (available) {
          biometrics.simplePrompt({ promptMessage: 'Confirm your identity' })
            .then((result) => {
              const { success } = result;

              if (success) {
                // Proceed to submit the vote
                axios.post(`http://192.168.231.161:8025/api/home/vote/${data.id}`, {
                  nominieeId
                },
                  {
                    headers: {
                      "x-access-token": session['token']
                    }
                  }
                )
                .then((response) => {
                  console.log(response);
                  if (response.status === 201) {
                    Toast.show({
                      type: 'success',
                      text1: 'Voted Successfully'
                    });
                  }
                  closeModal();
                })
                .catch(err => {
                  console.error(err);
                  Toast.show({
                    type: 'error',
                    text1: 'Some error occurred in creating poll',
                    text2: err.message
                  });
                  closeModal();
                });
              }
            })
            .catch(() => {
              Toast.show({
                type: 'error',
                text1: 'Authentication failed'
              });
            });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Biometric authentication not available'
          });
        }
      });
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
          {/* Ongoing Poll Title */}
          <Text style={styles.pollTitle}>Ongoing Poll</Text>
          
          {/* Lorem Ipsum Text */}
          <Text style={styles.loremText}>
            {data.title}
          </Text>

          {data.options.map((el: any) => (
            <View key={el.id} style={styles.card}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardText}>{el.name}</Text>
                  {/* Custom Vote Button */}
                  <TouchableOpacity style={styles.voteButton} onPress={() => {
                    setnominieeId(el.id);
                  }}>
                    <Text style={styles.voteButtonText}>Vote</Text>
                  </TouchableOpacity>
                </View>
              </View>
          ))}

          <TouchableOpacity 
            disabled={data.hasVoted ? true : false} 
            style={data.hasVoted ? styles.disabledSubmitButton : styles.submitButton} 
            onPress={handleVoteSubmit} // Use the new function
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
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
    alignItems: 'flex-start', // Align items to the left
  },
  pollTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 60,
    color: '#4caf50', // Blue color for the title
    textAlign: 'center', // Center align text
    marginBottom: 10, // Adjust spacing below title
    marginTop: 10, // Add spacing above title
  },
  loremText: {
    fontSize: 16,
    color: '#ccc', // Grey color for the lorem text
    textAlign: 'left',
    marginBottom: 20, // Spacing below lorem text
  },
  card: {
    width: '100%', // Full width of the container
    height: 60, // Adjust height as needed
    borderRadius: 26,
    justifyContent: 'center', // Center contents
    alignItems: 'flex-start', // Align items to the left
    marginTop: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative', // For button positioning
    padding: 10,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000', // Black color for poll question
    textAlign: 'left',
    flex: 1, // Take remaining space
  },
  buttonContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Space between text and button
    alignItems: 'center', // Center vertically
    width: '100%', // Full width
  },
  voteButton: {
    backgroundColor: '#2e5fd1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20, // Space between the card and submit button
    backgroundColor: '#4caf50', // Green background color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center', // Center the text
    justifyContent: 'center',
    alignSelf: 'center', // Center submit button horizontally
  },
  disabledSubmitButton: {
    marginTop: 20, // Space between the card and submit button
    backgroundColor: '#888888', // grey background color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center', // Center the text
    justifyContent: 'center',
    alignSelf: 'center', // Center submit button horizontally
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Ongoing;
