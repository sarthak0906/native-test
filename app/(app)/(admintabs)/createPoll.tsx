import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useQuery } from 'react-query';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useSession } from '../../../ctx';

const CreatePoll = () => {
  const { session } = useSession();
  const fetchUsers = async () => {
    const { data } = await axios.get('http://103.205.65.68:8025/api/admin/user/get', {
      headers: {
        "x-access-token": session?.token
      }
    });
    return data;
  };

  const useUsers = () => useQuery('users', fetchUsers);

  const { data, isLoading, isSuccess } = useUsers();

  const [pollHeading, setPollHeading] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [startDate, setstartDate] = useState<string>('');
  const [endDate, setendDate] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (data){
      setOptions(data.data.body.users.map((el: { id: any; firstname: string; lastname: string; }) => {
        return {
          id: el.id,
          name: el.firstname + " " + el.lastname
        }
      }))
    }
  }, [data]);

  const handleOptionSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option) // Remove if already selected
        : [...prev, option] // Add if not selected
    );
  };

  const handleCreatePoll = () => {
    if (!pollHeading) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill poll heading'
      });
      return;
    }
    if (!selectedOptions || !selectedOptions.length) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please select options'
      });
      return;
    }
    if (!startDate) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill start Date'
      });
      return;
    }
    if (!endDate) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill end Date'
      });
      return;
    }

    axios.post('http://103.205.65.68:8025/api/admin/poll/create', {
      title: pollHeading, 
      options: selectedOptions.map(el => el['id']), 
      startDate: startDate, 
      endDate: endDate
    },
      {
        headers: {
          "x-access-token": session['token']
        }
      }
    )
    .then((data) => {
      console.log(data);
      if (data.status == 201) Toast.show({
        type: 'success',
        text1: 'Poll Created'
      });
    })
    .catch(err => {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Some error Occured in creating poll',
        text2: err
      });
    })
  };

  return (
    <View style={styles.container}>
        <Text style={styles.label1}>CREATE POLL</Text>
      <Text style={styles.label}>Poll Heading:</Text>
      <TextInput
        style={styles.input}
        value={pollHeading}
        onChangeText={setPollHeading}
        maxLength={200}
        placeholder="Enter poll heading"
      />

      <Text style={styles.label}>Select Options:</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdownButton}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedOptions.length > 0
            ? selectedOptions.map(el => el['name']).join(', ')
            : 'Choose options'}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleOptionSelect(item)}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>
                    {selectedOptions.includes(item) ? '✓ ' : ''}{item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Start Date:</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setstartDate}
        maxLength={200}
        placeholder="Enter poll start date"
      />
      <Text style={styles.label}>End Date:</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setendDate}
        maxLength={200}
        placeholder="Enter poll end date"
      />
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={handleCreatePoll} style={styles.createButton}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => router.push("/(app)/(admintabs)")} 
          style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.89)',
    flex: 1,
  },
  label1: {
    fontSize: 26,
    marginBottom: 100,
    color: '#2e5fd1',
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "white"
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2e5fd1',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  option: {
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#e66465',
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CreatePoll;
