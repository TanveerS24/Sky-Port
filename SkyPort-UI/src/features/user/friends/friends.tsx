import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/themeProvider.context';
import { getUserByEmail, getUserByEmailHash, sendFriendRequest, approveFriendRequest, rejectFriendRequest, markNotificationsRead } from '../../../api/user.api';
import { getFromSecureStore } from '../../../utils/secureStore.util';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface Friend {
    emailHash: string;
    email: string;
    username: string;
}

interface FriendRequest {
    emailHash: string;
    email: string;
    username: string;
    sentAt: Date;
}

export default function Friends() {
    const { colors } = useTheme();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchedUser, setSearchedUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadUserData();
            markNotifications();
        }, [])
    );

    const markNotifications = async () => {
        try {
            const userEmail = await getFromSecureStore('userEmail');
            if (userEmail) {
                await markNotificationsRead(userEmail);
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const loadUserData = async () => {
        try {
            setRefreshing(true);
            const userEmail = await getFromSecureStore('userEmail');
            if (userEmail) {
                const userData = await getUserByEmail(userEmail);
                
                // Load friends
                const friendsData = await Promise.all(
                    (userData.friends || []).map(async (emailHash: string) => {
                        try {
                            const friendData = await getUserByEmailHash(emailHash);
                            return {
                                emailHash: friendData.emailHash,
                                email: friendData.email,
                                username: friendData.username
                            };
                        } catch (error) {
                            console.error('Error loading friend:', error);
                            return null;
                        }
                    })
                );
                setFriends(friendsData.filter(f => f !== null));

                // Load requests
                setIncomingRequests(userData.friendRequests?.incoming || []);
                setOutgoingRequests(userData.friendRequests?.outgoing || []);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load friends data');
        } finally {
            setRefreshing(false);
        }
    };

    const handleSearchUser = async () => {
        if (!searchEmail.trim()) {
            Alert.alert('Error', 'Please enter an email address');
            return;
        }

        try {
            setLoading(true);
            const user = await getUserByEmail(searchEmail.trim());
            setSearchedUser(user);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'User not found');
            setSearchedUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async () => {
        try {
            const userEmail = await getFromSecureStore('userEmail');
            if (!userEmail || !searchedUser) return;

            setLoading(true);
            await sendFriendRequest(userEmail, searchedUser.email);
            Alert.alert('Success', 'Friend request sent!');
            setModalVisible(false);
            setSearchEmail('');
            setSearchedUser(null);
            loadUserData(); // Refresh data
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to send friend request');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requesterEmailHash: string) => {
        try {
            const userEmail = await getFromSecureStore('userEmail');
            if (!userEmail) return;

            setLoading(true);
            await approveFriendRequest(userEmail, requesterEmailHash);
            Alert.alert('Success', 'Friend request approved!');
            loadUserData(); // Refresh data
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to approve request');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (requesterEmailHash: string) => {
        try {
            const userEmail = await getFromSecureStore('userEmail');
            if (!userEmail) return;

            setLoading(true);
            await rejectFriendRequest(userEmail, requesterEmailHash);
            Alert.alert('Success', 'Friend request rejected');
            loadUserData(); // Refresh data
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to reject request');
        } finally {
            setLoading(false);
        }
    };

    const renderFriend = ({ item }: { item: Friend }) => (
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            <View style={styles.cardContent}>
                <Ionicons name="person-circle" size={40} color={colors.primary} />
                <View style={styles.cardText}>
                    <Text style={[styles.username, { color: colors.textPrimary }]}>{item.username}</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
                </View>
            </View>
        </View>
    );

    const renderIncomingRequest = ({ item }: { item: FriendRequest }) => (
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            <View style={styles.cardContent}>
                <Ionicons name="person-add" size={40} color={colors.primary} />
                <View style={styles.cardText}>
                    <Text style={[styles.username, { color: colors.textPrimary }]}>{item.username}</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <Pressable 
                    style={[styles.button, styles.approveButton]} 
                    onPress={() => handleApproveRequest(item.emailHash)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Approve</Text>
                </Pressable>
                <Pressable 
                    style={[styles.button, styles.rejectButton]} 
                    onPress={() => handleRejectRequest(item.emailHash)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Reject</Text>
                </Pressable>
            </View>
        </View>
    );

    const renderOutgoingRequest = ({ item }: { item: FriendRequest }) => (
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            <View style={styles.cardContent}>
                <Ionicons name="time" size={40} color={colors.textSecondary} />
                <View style={styles.cardText}>
                    <Text style={[styles.username, { color: colors.textPrimary }]}>{item.username}</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
                    <Text style={[styles.pending, { color: colors.textSecondary }]}>Pending...</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <FlatList
                data={[]}
                ListHeaderComponent={
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.headingPrimary }]}>Friends</Text>
                        {friends.length === 0 ? (
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No friends yet. Add some friends!
                            </Text>
                        ) : (
                            <FlatList
                                data={friends}
                                renderItem={renderFriend}
                                keyExtractor={(item, index) => `friend-${index}`}
                                scrollEnabled={false}
                            />
                        )}

                        <Text style={[styles.sectionTitle, { color: colors.headingPrimary }]}>
                            Incoming Requests
                        </Text>
                        {incomingRequests.length === 0 ? (
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No incoming requests
                            </Text>
                        ) : (
                            <FlatList
                                data={incomingRequests}
                                renderItem={renderIncomingRequest}
                                keyExtractor={(item, index) => `incoming-${index}`}
                                scrollEnabled={false}
                            />
                        )}

                        <Text style={[styles.sectionTitle, { color: colors.headingPrimary }]}>
                            Outgoing Requests
                        </Text>
                        {outgoingRequests.length === 0 ? (
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No outgoing requests
                            </Text>
                        ) : (
                            <FlatList
                                data={outgoingRequests}
                                renderItem={renderOutgoingRequest}
                                keyExtractor={(item, index) => `outgoing-${index}`}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                }
                refreshing={refreshing}
                onRefresh={loadUserData}
                renderItem={null}
            />

            {/* Floating Action Button */}
            <Pressable 
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="person-add" size={28} color="#fff" />
            </Pressable>

            {/* Search Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSearchEmail('');
                    setSearchedUser(null);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.headingPrimary }]}>
                                Add Friend
                            </Text>
                            <Pressable onPress={() => {
                                setModalVisible(false);
                                setSearchEmail('');
                                setSearchedUser(null);
                            }}>
                                <Ionicons name="close" size={28} color={colors.textPrimary} />
                            </Pressable>
                        </View>

                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.bgPrimary, 
                                color: colors.textPrimary,
                                borderColor: colors.textSecondary 
                            }]}
                            placeholder="Enter email address"
                            placeholderTextColor={colors.textSecondary}
                            value={searchEmail}
                            onChangeText={setSearchEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Pressable 
                            style={[styles.searchButton, { backgroundColor: colors.primary }]}
                            onPress={handleSearchUser}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.searchButtonText}>Search</Text>
                            )}
                        </Pressable>

                        {searchedUser && (
                            <View style={[styles.searchResult, { backgroundColor: colors.bgPrimary }]}>
                                <View style={styles.cardContent}>
                                    <Ionicons name="person-circle" size={50} color={colors.primary} />
                                    <View style={styles.cardText}>
                                        <Text style={[styles.username, { color: colors.textPrimary }]}>
                                            {searchedUser.username}
                                        </Text>
                                        <Text style={[styles.email, { color: colors.textSecondary }]}>
                                            {searchedUser.email}
                                        </Text>
                                    </View>
                                </View>
                                <Pressable 
                                    style={[styles.button, styles.sendRequestButton]}
                                    onPress={handleSendRequest}
                                    disabled={loading}
                                >
                                    <Text style={styles.buttonText}>Send Request</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardText: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        marginTop: 4,
    },
    pending: {
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#f44336',
    },
    sendRequestButton: {
        backgroundColor: '#2196F3',
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    searchButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    searchResult: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
    },
});