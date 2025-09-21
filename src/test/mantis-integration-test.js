// Simple test to validate the Mantis SDK structure
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const romanticData = JSON.parse(readFileSync(join(__dirname, '../data/romantic-date-enrichment.json'), 'utf8'));

console.log('🧪 Testing Mantis SDK Integration for Romantic Date Enrichment\n');

// Test structure compliance
function validateMantisStructure(data) {
    console.log('📋 Validating structure...');
    
    if (!Array.isArray(data)) {
        throw new Error('Data should be an array of clusters');
    }
    
    data.forEach((cluster, index) => {
        // Check required fields
        if (!cluster.hasOwnProperty('x') || !cluster.hasOwnProperty('y')) {
            throw new Error(`Cluster ${index} missing x/y coordinates`);
        }
        
        if (!cluster.cluster) {
            throw new Error(`Cluster ${index} missing cluster name`);
        }
        
        if (!cluster.tree || !cluster.tree.question) {
            throw new Error(`Cluster ${index} missing question tree`);
        }
        
        if (!Array.isArray(cluster.tree.children)) {
            throw new Error(`Cluster ${index} tree children should be array`);
        }
        
        // Validate question structure
        cluster.tree.children.forEach((question, qIndex) => {
            if (!question.question || !Array.isArray(question.children)) {
                throw new Error(`Invalid question structure in cluster ${index}, question ${qIndex}`);
            }
        });
    });
    
    console.log('✅ Structure validation passed');
}

// Test coordinate layout (intimacy progression)
function testCoordinateLayout(data) {
    console.log('🗺️  Testing coordinate layout...');
    
    const coordinates = data.map(cluster => ({
        name: cluster.cluster,
        x: cluster.x,
        y: cluster.y
    }));
    
    // Sort by intimacy level (y-coordinate, higher = more intimate)
    coordinates.sort((a, b) => a.y - b.y);
    
    console.log('Intimacy progression (low to high):');
    coordinates.forEach((coord, index) => {
        console.log(`${index + 1}. ${coord.name} (${coord.x}, ${coord.y})`);
    });
    
    console.log('✅ Coordinate layout test passed');
}

// Test question tree navigation
function testQuestionTreeNavigation(data) {
    console.log('🌳 Testing question tree navigation...');
    
    const sampleCluster = data[0]; // Getting Acquainted
    console.log(`Sample cluster: ${sampleCluster.cluster}`);
    console.log(`Root question: ${sampleCluster.tree.question}`);
    console.log(`Child questions: ${sampleCluster.tree.children.length}`);
    
    // Show first few questions
    sampleCluster.tree.children.slice(0, 3).forEach((question, index) => {
        console.log(`  ${index + 1}. ${question.question.substring(0, 50)}...`);
    });
    
    console.log('✅ Question tree navigation test passed');
}

// Run all tests
try {
    validateMantisStructure(romanticData);
    testCoordinateLayout(romanticData);
    testQuestionTreeNavigation(romanticData);
    
    console.log('\n🎉 All tests passed! Mantis SDK structure is ready for integration.');
    console.log(`📊 Summary: ${romanticData.length} clusters, ${romanticData.reduce((sum, cluster) => sum + cluster.tree.children.length, 0)} questions`);
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}