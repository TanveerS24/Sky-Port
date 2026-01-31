import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { getFiles } from '../../../api/files.api';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../context/themeProvider.context';

interface FileStats {
    totalFiles: number;
    totalStorage: number;
    images: number;
    videos: number;
    documents: number;
    others: number;
    imagesStorage: number;
    videosStorage: number;
    documentsStorage: number;
    othersStorage: number;
}

export default function Dashboard() {
    const { colors } = useTheme();
    const [stats, setStats] = useState<FileStats>({
        totalFiles: 0,
        totalStorage: 0,
        images: 0,
        videos: 0,
        documents: 0,
        others: 0,
        imagesStorage: 0,
        videosStorage: 0,
        documentsStorage: 0,
        othersStorage: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFileStats();
    }, []);

    const fetchFileStats = async () => {
        try {
            setLoading(true);
            const files = await getFiles(null);
            
            if (!Array.isArray(files)) {
                console.error('Invalid files data:', files);
                return;
            }

            let totalStorage = 0;
            let images = 0;
            let videos = 0;
            let documents = 0;
            let others = 0;
            let imagesStorage = 0;
            let videosStorage = 0;
            let documentsStorage = 0;
            let othersStorage = 0;

            files.forEach((file: any) => {
                const size = file.size || 0;
                totalStorage += size;

                const mimeType = file.mimeType?.toLowerCase() || file.type?.toLowerCase() || '';
                const fileName = file.fileName?.toLowerCase() || file.name?.toLowerCase() || '';

                // Categorize files by mimeType
                if (mimeType.includes('image/') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)) {
                    images++;
                    imagesStorage += size;
                } else if (mimeType.includes('video/') || /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/.test(fileName)) {
                    videos++;
                    videosStorage += size;
                } else if (
                    mimeType.includes('pdf') || 
                    mimeType.includes('application/pdf') ||
                    mimeType.includes('text/') || 
                    mimeType.includes('application/msword') ||
                    mimeType.includes('application/vnd.openxmlformats-officedocument') ||
                    mimeType.includes('application/vnd.ms-excel') ||
                    mimeType.includes('application/vnd.ms-powerpoint') ||
                    /\.(pdf|txt|doc|docx|xls|xlsx|ppt|pptx)$/.test(fileName)
                ) {
                    documents++;
                    documentsStorage += size;
                } else {
                    others++;
                    othersStorage += size;
                }
            });

            setStats({
                totalFiles: files.length,
                totalStorage,
                images,
                videos,
                documents,
                others,
                imagesStorage,
                videosStorage,
                documentsStorage,
                othersStorage
            });
        } catch (error) {
            console.error('Error fetching file stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatStorage = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    };

    const formatStorageForChart = (bytes: number): number => {
        if (bytes === 0) return 0;
        const mb = bytes / 1024 / 1024;
        return Math.round(mb * 100) / 100; // Round to 2 decimal places
    };

    const chartData = [
        {
            name: 'Images',
            count: stats.images,
            color: '#4CAF50',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        },
        {
            name: 'Videos',
            count: stats.videos,
            color: '#2196F3',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        },
        {
            name: 'Documents',
            count: stats.documents,
            color: '#FF9800',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        },
        {
            name: 'Others',
            count: stats.others,
            color: '#9E9E9E',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        }
    ].filter(item => item.count > 0); // Only show categories with files

    const storageChartData = [
        {
            name: 'Images',
            storage: stats.imagesStorage,
            percentage: stats.totalStorage > 0 ? (stats.imagesStorage / stats.totalStorage * 100) : 0,
            color: '#4CAF50',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        },
        {
            name: 'Videos',
            storage: stats.videosStorage,
            percentage: stats.totalStorage > 0 ? (stats.videosStorage / stats.totalStorage * 100) : 0,
            color: '#2196F3',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        },
        {
            name: 'Documents',
            storage: stats.documentsStorage,
            percentage: stats.totalStorage > 0 ? (stats.documentsStorage / stats.totalStorage * 100) : 0,
            color: '#FF9800',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        },
        {
            name: 'Others',
            storage: stats.othersStorage,
            percentage: stats.totalStorage > 0 ? (stats.othersStorage / stats.totalStorage * 100) : 0,
            color: '#9E9E9E',
            legendFontColor: colors.textPrimary,
            legendFontSize: 14
        }
    ].filter(item => item.storage > 0); // Only show categories with storage

    const screenWidth = Dimensions.get('window').width;

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.bgPrimary }]}>
                <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.bgPrimary }]} contentContainerStyle={styles.contentContainer}>
            <Text style={[styles.title, { color: colors.headingPrimary }]}>Dashboard</Text>
            
            {/* Statistics Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.statValue}>{stats.totalFiles}</Text>
                        <Text style={styles.statLabel}>Total Files</Text>
                    </LinearGradient>
                </View>

                <View style={styles.statCard}>
                    <LinearGradient
                        colors={['#f093fb', '#f5576c']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.statValue}>{formatStorage(stats.totalStorage)}</Text>
                        <Text style={styles.statLabel}>Storage Used</Text>
                    </LinearGradient>
                </View>
            </View>

            {/* Detailed Stats Row */}
            <View style={styles.detailsContainer}>
                <View style={[styles.detailCard, { borderLeftColor: '#4CAF50', backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{stats.images}</Text>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Images</Text>
                </View>

                <View style={[styles.detailCard, { borderLeftColor: '#2196F3', backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{stats.videos}</Text>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Videos</Text>
                </View>

                <View style={[styles.detailCard, { borderLeftColor: '#FF9800', backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{stats.documents}</Text>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Documents</Text>
                </View>
            </View>

            {/* Circular Chart */}
            {chartData.length > 0 && (
                <View style={[styles.chartContainer, { backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.chartTitle, { color: colors.headingPrimary }]}>File Distribution</Text>
                    <PieChart
                        data={chartData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => colors.textPrimary,
                            labelColor: (opacity = 1) => colors.textPrimary,
                        }}
                        accessor="count"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        hasLegend={true}
                    />
                </View>
            )}

            {/* Storage Distribution Pie Chart */}
            {storageChartData.length > 0 && (
                <View style={[styles.chartContainer, { backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.chartTitle, { color: colors.headingPrimary }]}>Storage Distribution</Text>
                    <PieChart
                        data={storageChartData.map(item => ({
                            name: item.name,
                            population: item.storage,
                            color: item.color,
                            legendFontColor: item.legendFontColor,
                            legendFontSize: 12
                        }))}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => colors.textPrimary,
                            labelColor: (opacity = 1) => colors.textPrimary,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        hasLegend={true}
                    />
                    <View style={styles.storageDetails}>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Images: {formatStorage(stats.imagesStorage)}
                            </Text>
                        </View>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#2196F3' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Videos: {formatStorage(stats.videosStorage)}
                            </Text>
                        </View>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#FF9800' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Documents: {formatStorage(stats.documentsStorage)}
                            </Text>
                        </View>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#9E9E9E' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Others: {formatStorage(stats.othersStorage)}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Storage Usage Chart */}
            {stats.totalStorage > 0 && (
                <View style={[styles.chartContainer, { backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.chartTitle, { color: colors.headingPrimary }]}>Storage Usage by Type</Text>
                    <BarChart
                        data={{
                            labels: ['Images', 'Videos', 'Docs', 'Others'],
                            datasets: [{
                                data: [
                                    formatStorageForChart(stats.imagesStorage),
                                    formatStorageForChart(stats.videosStorage),
                                    formatStorageForChart(stats.documentsStorage),
                                    formatStorageForChart(stats.othersStorage)
                                ].map(val => Math.max(val, 0.01)) // Ensure minimum value for visibility
                            }]
                        }}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" MB"
                        chartConfig={{
                            backgroundColor: colors.bgSecondary,
                            backgroundGradientFrom: colors.bgSecondary,
                            backgroundGradientTo: colors.bgSecondary,
                            decimalPlaces: 2,
                            color: (opacity = 1) => colors.btnPrimaryBg,
                            labelColor: (opacity = 1) => colors.textPrimary,
                            style: {
                                borderRadius: 16,
                            },
                            propsForLabels: {
                                fontSize: 12,
                            },
                            propsForBackgroundLines: {
                                strokeDasharray: '',
                                stroke: colors.borderMuted,
                                strokeWidth: 1,
                            }
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        fromZero
                        showValuesOnTopOfBars
                    />
                    <View style={styles.storageDetails}>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Images: {formatStorage(stats.imagesStorage)}
                            </Text>
                        </View>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#2196F3' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Videos: {formatStorage(stats.videosStorage)}
                            </Text>
                        </View>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#FF9800' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Documents: {formatStorage(stats.documentsStorage)}
                            </Text>
                        </View>
                        <View style={styles.storageItem}>
                            <View style={[styles.colorBox, { backgroundColor: '#9E9E9E' }]} />
                            <Text style={[styles.storageLabel, { color: colors.textSecondary }]}>
                                Others: {formatStorage(stats.othersStorage)}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {stats.totalFiles === 0 && (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No files uploaded yet</Text>
                    <Text style={[styles.emptyStateSubtext, { color: colors.textMuted }]}>Upload your first file to see statistics</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
    },
    gradient: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    detailCard: {
        flex: 1,
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 5,
        borderLeftWidth: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    detailValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 12,
    },
    chartContainer: {
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    emptyState: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyStateSubtext: {
        fontSize: 14,
    },
    storageDetails: {
        marginTop: 15,
        gap: 8,
    },
    storageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
    },
    storageLabel: {
        fontSize: 13,
    },
});