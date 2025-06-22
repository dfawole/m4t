//client/src/components/course/SkillTreeGraph.tsx
import React, { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Lock, CheckCircle2, Trophy, Zap } from 'lucide-react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

// Define the node and link types for our graph
interface GraphNode {
  id: string;
  name: string;
  level: number;
  status: 'locked' | 'available' | 'completed';
  type: 'skill' | 'module' | 'lesson' | 'quiz' | 'challenge';
  description?: string;
  pointsReward?: number;
  color?: string;
  size?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  url?: string;
  prerequisites?: string[];
  x?: number;
  y?: number;
  z?: number;
}

interface GraphLink {
  source: string;
  target: string;
  strength?: number;
  color?: string;
}

interface SkillTreeGraphProps {
  courseId: number;
  initialData?: { nodes: GraphNode[], links: GraphLink[] };
  onNodeClick?: (node: GraphNode) => void;
  userProgress?: {
    completedNodes: string[];
    totalProgress: number; // 0-100 percentage
    currentNode?: string; // Currently active node ID
  };
  onNodeComplete?: (nodeId: string) => void;
  showProgressSummary?: boolean;
}

// Node colors based on status
const NODE_COLORS = {
  locked: '#718096',     // Gray
  available: '#3182ce',  // Blue
  completed: '#38a169',  // Green
};

// Node sizes based on type
const NODE_SIZES = {
  skill: 6,
  module: 8,
  lesson: 5,
  quiz: 6,
  challenge: 7,
};

// Custom node object with Three.js
const createNodeObject = (node: GraphNode) => {
  let color = node.color || NODE_COLORS[node.status];
  let size = node.size || NODE_SIZES[node.type];
  
  // Create geometry based on node type
  let geometry;
  switch (node.type) {
    case 'skill':
      geometry = new THREE.OctahedronGeometry(size);
      break;
    case 'module':
      geometry = new THREE.BoxGeometry(size, size, size);
      break;
    case 'lesson':
      geometry = new THREE.SphereGeometry(size);
      break;
    case 'quiz':
      geometry = new THREE.TetrahedronGeometry(size);
      break;
    case 'challenge':
      geometry = new THREE.TorusGeometry(size, size / 3, 16, 100);
      break;
    default:
      geometry = new THREE.SphereGeometry(size);
  }
  
  const material = new THREE.MeshLambertMaterial({ 
    color, 
    transparent: node.status === 'locked',
    opacity: node.status === 'locked' ? 0.6 : 1
  });
  
  return new THREE.Mesh(geometry, material);
};

const SkillTreeGraph: React.FC<SkillTreeGraphProps> = ({ 
  courseId, 
  initialData,
  onNodeClick,
  userProgress = { completedNodes: [], totalProgress: 0 },
  onNodeComplete,
  showProgressSummary = true
}) => {
  const graphRef = useRef<any>();
  const [loading, setLoading] = useState(!initialData);
  const [graphData, setGraphData] = useState(initialData || { nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [completionAnimation, setCompletionAnimation] = useState<{nodeId: string, active: boolean} | null>(null);
  
  // Fetch skill tree data if not provided
  useEffect(() => {
    if (!initialData) {
      fetchSkillTreeData();
    }
  }, [courseId, initialData]);
  
  // Fetch skill tree data from API
  const fetchSkillTreeData = async () => {
    try {
      setLoading(true);
      // Replace with actual API call when ready
      // const response = await fetch(`/api/courses/${courseId}/skill-tree`);
      // const data = await response.json();
      
      // Sample data for development
      setTimeout(() => {
        const sampleData = generateSampleSkillTree();
        setGraphData(sampleData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching skill tree data:', error);
      setLoading(false);
    }

    // replace with this when ready:
    // try {
    //   const res = await fetchWithAuth(`/api/courses/${courseId}/skill-tree`);
    //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
    //   const data: { nodes: GraphNode[]; links: GraphLink[] } = await res.json();
    //   setGraphData(data);
    // } catch (err) {
    //   console.error('Error fetching skill tree:', err);
    //   // fallback to sample data
    //   setGraphData(generateSampleSkillTree());
    // } finally {
    //   setLoading(false);
    // }
  };
  
  // Handle node click
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setShowInfo(true);
    
    // Call custom click handler if provided
    if (onNodeClick) {
      onNodeClick(node);
    }

    // Update node completion status if available and node is available but not completed
    if (
      onNodeComplete && 
      node.status === 'available' && 
      !userProgress.completedNodes.includes(node.id)
    ) {
      // Set the node for animation
      setCompletionAnimation({ nodeId: node.id, active: true });
      
      // Notify parent of completion
      setTimeout(() => {
        onNodeComplete(node.id);
      }, 1000);
      
      // End animation after effect
      setTimeout(() => {
        setCompletionAnimation(null);
      }, 2000);
    }
    
    // Focus camera on the selected node
    // if (graphRef.current) {
    //   const distance = 40;
    //   const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    //   if (graphRef.current.cameraPosition) {
    //     graphRef.current.cameraPosition(
    //       { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
    //       node,
    //       2000
    //     );
    //   }
    // }

    // Focus camera on the selected node
    const { x, y, z } = node;
    if (graphRef.current && x != null && y != null && z != null) {
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(x, y, z);
      graphRef.current.cameraPosition(
        { x: x * distRatio, y: y * distRatio, z: z * distRatio },
        node,
        2000
      );
    }
  };
  
  // Close info panel
  const handleCloseInfo = () => {
    setShowInfo(false);
    setSelectedNode(null);
  };
  
  // Generate dynamic node label
  const getNodeLabel = (node: GraphNode) => {
    return `<div style="
      color: white;
      background-color: rgba(0,0,0,0.7);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      pointer-events: none;
      white-space: nowrap;
    ">
      <strong>${node.name}</strong>
      ${node.difficulty ? `<div>Level: ${node.difficulty}</div>` : ''}
      ${node.status !== 'locked' ? `<div>Status: ${node.status}</div>` : '<div>Locked</div>'}
    </div>`;
  };
  
  // Generate a sample skill tree for development
  const generateSampleSkillTree = () => {
    // Create nodes for skills
    const nodes: GraphNode[] = [
      {
        id: 'programming_basics',
        name: 'Programming Fundamentals',
        type: 'module',
        level: 1,
        status: 'completed',
        description: 'Learn the core concepts of programming including variables, data types, and control structures.',
        difficulty: 'beginner',
        pointsReward: 100
      },
      {
        id: 'variables',
        name: 'Variables & Data Types',
        type: 'lesson',
        level: 1,
        status: 'completed',
        description: 'Understanding how to store and manipulate data in programming.',
        difficulty: 'beginner',
        pointsReward: 25
      },
      {
        id: 'control_structures',
        name: 'Control Structures',
        type: 'lesson',
        level: 1,
        status: 'completed',
        description: 'Learn about if/else statements, loops, and other flow control mechanisms.',
        difficulty: 'beginner',
        pointsReward: 25
      },
      {
        id: 'functions',
        name: 'Functions',
        type: 'lesson',
        level: 1,
        status: 'completed',
        description: 'Create reusable blocks of code with functions.',
        difficulty: 'beginner',
        pointsReward: 30
      },
      {
        id: 'basics_quiz',
        name: 'Programming Basics Quiz',
        type: 'quiz',
        level: 1,
        status: 'completed',
        description: 'Test your knowledge of programming fundamentals.',
        difficulty: 'beginner',
        pointsReward: 50
      },
      {
        id: 'oop_basics',
        name: 'Object-Oriented Programming',
        type: 'module',
        level: 2,
        status: 'available',
        description: 'Learn the principles of object-oriented programming and how to use classes and objects.',
        difficulty: 'intermediate',
        pointsReward: 150
      },
      {
        id: 'classes_objects',
        name: 'Classes & Objects',
        type: 'lesson',
        level: 2,
        status: 'available',
        description: 'Understand how to create and use classes and objects.',
        difficulty: 'intermediate',
        pointsReward: 35
      },
      {
        id: 'inheritance',
        name: 'Inheritance',
        type: 'lesson',
        level: 2,
        status: 'locked',
        description: 'Learn how to extend classes and inherit properties and methods.',
        difficulty: 'intermediate',
        pointsReward: 40
      },
      {
        id: 'polymorphism',
        name: 'Polymorphism',
        type: 'lesson',
        level: 2,
        status: 'locked',
        description: 'Understand how to use polymorphism to write flexible and reusable code.',
        difficulty: 'intermediate',
        pointsReward: 45
      },
      {
        id: 'oop_challenge',
        name: 'OOP Challenge',
        type: 'challenge',
        level: 2,
        status: 'locked',
        description: 'Apply your OOP knowledge to solve a real-world problem.',
        difficulty: 'intermediate',
        pointsReward: 75
      },
      {
        id: 'advanced_topics',
        name: 'Advanced Programming',
        type: 'module',
        level: 3,
        status: 'locked',
        description: 'Explore advanced programming concepts including design patterns and algorithms.',
        difficulty: 'advanced',
        pointsReward: 200
      },
      {
        id: 'algorithms',
        name: 'Algorithms & Data Structures',
        type: 'skill',
        level: 3,
        status: 'locked',
        description: 'Master common algorithms and data structures.',
        difficulty: 'advanced',
        pointsReward: 100
      },
      {
        id: 'design_patterns',
        name: 'Design Patterns',
        type: 'skill',
        level: 3,
        status: 'locked',
        description: 'Learn common design patterns and when to use them.',
        difficulty: 'advanced',
        pointsReward: 100
      },
      {
        id: 'final_project',
        name: 'Final Course Project',
        type: 'challenge',
        level: 3,
        status: 'locked',
        description: 'Build a complete application applying all concepts learned in the course.',
        difficulty: 'expert',
        pointsReward: 300
      }
    ];
    
    // Create links between nodes
    const links: GraphLink[] = [
      // Basics module connections
      { source: 'programming_basics', target: 'variables', strength: 0.7 },
      { source: 'programming_basics', target: 'control_structures', strength: 0.7 },
      { source: 'programming_basics', target: 'functions', strength: 0.7 },
      { source: 'programming_basics', target: 'basics_quiz', strength: 0.9 },
      
      // Dependencies between basics lessons
      { source: 'variables', target: 'control_structures', strength: 0.5 },
      { source: 'control_structures', target: 'functions', strength: 0.5 },
      { source: 'functions', target: 'basics_quiz', strength: 0.5 },
      
      // Basics to OOP connection
      { source: 'programming_basics', target: 'oop_basics', strength: 0.8 },
      { source: 'basics_quiz', target: 'oop_basics', strength: 0.6 },
      
      // OOP module connections
      { source: 'oop_basics', target: 'classes_objects', strength: 0.7 },
      { source: 'oop_basics', target: 'inheritance', strength: 0.7 },
      { source: 'oop_basics', target: 'polymorphism', strength: 0.7 },
      { source: 'oop_basics', target: 'oop_challenge', strength: 0.9 },
      
      // Dependencies between OOP lessons
      { source: 'classes_objects', target: 'inheritance', strength: 0.5 },
      { source: 'inheritance', target: 'polymorphism', strength: 0.5 },
      { source: 'polymorphism', target: 'oop_challenge', strength: 0.5 },
      
      // OOP to Advanced connection
      { source: 'oop_basics', target: 'advanced_topics', strength: 0.8 },
      { source: 'oop_challenge', target: 'advanced_topics', strength: 0.6 },
      
      // Advanced module connections
      { source: 'advanced_topics', target: 'algorithms', strength: 0.7 },
      { source: 'advanced_topics', target: 'design_patterns', strength: 0.7 },
      { source: 'advanced_topics', target: 'final_project', strength: 0.9 },
      
      // Dependencies between advanced topics
      { source: 'algorithms', target: 'final_project', strength: 0.5 },
      { source: 'design_patterns', target: 'final_project', strength: 0.5 }
    ];
    
    return { nodes, links };
  };
  
  // Get color for links based on nodes' status
  const getLinkColor = (link: GraphLink) => {
    // Find source and target nodes
    const sourceNode = graphData.nodes.find(node => node.id === link.source);
    const targetNode = graphData.nodes.find(node => node.id === link.target);
    
    if (!sourceNode || !targetNode) return '#aaa';
    
    // If both ends are completed, show as completed
    if (sourceNode.status === 'completed' && targetNode.status === 'completed') {
      return '#38a169';  // Green
    }
    
    // If source is completed and target is available, show as available
    if (sourceNode.status === 'completed' && targetNode.status === 'available') {
      return '#3182ce';  // Blue
    }
    
    // Otherwise show as locked/gray
    return '#a0aec0';
  };
  
  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
          <div className="text-gray-500">Loading skill tree...</div>
        </div>
      </div>
    );
  }
  
  // Modify node object creation to include animation for completing nodes
  const createNodeObjectWithAnimation = (node: GraphNode) => {
    let color = node.color || NODE_COLORS[node.status];
    let size = node.size || NODE_SIZES[node.type];
    
    // If this node is currently being completed, apply animation effect
    if (completionAnimation && completionAnimation.active && completionAnimation.nodeId === node.id) {
      // Pulse animation - increase size
      size = size * 1.5;
      // Change color to completion color
      color = NODE_COLORS.completed;
    }
    
    // Override status color if node is completed according to user progress
    if (userProgress.completedNodes.includes(node.id) && node.status !== 'completed') {
      color = NODE_COLORS.completed;
    }
    
    // Create appropriate geometry based on node type
    let geometry;
    switch (node.type) {
      case 'skill':
        geometry = new THREE.OctahedronGeometry(size);
        break;
      case 'module':
        geometry = new THREE.BoxGeometry(size, size, size);
        break;
      case 'lesson':
        geometry = new THREE.SphereGeometry(size);
        break;
      case 'quiz':
        geometry = new THREE.TetrahedronGeometry(size);
        break;
      case 'challenge':
        geometry = new THREE.TorusGeometry(size, size / 3, 16, 100);
        break;
      default:
        geometry = new THREE.SphereGeometry(size);
    }
    
    const material = new THREE.MeshLambertMaterial({ 
      color, 
      transparent: node.status === 'locked',
      opacity: node.status === 'locked' ? 0.6 : 1,
      emissive: completionAnimation?.nodeId === node.id ? new THREE.Color(color) : new THREE.Color(0x000000),
      emissiveIntensity: completionAnimation?.nodeId === node.id ? 0.5 : 0
    });
    
    return new THREE.Mesh(geometry, material);
  };

  return (
    <div className="relative h-[600px] w-full rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* 3D Force Graph */}
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={getNodeLabel}
        nodeColor={(node: GraphNode) => {
          // Override color if node is completed in user progress
          if (userProgress.completedNodes.includes(node.id)) {
            return NODE_COLORS.completed;
          }
          return node.color || NODE_COLORS[node.status];
        }}
        linkColor={(link: GraphLink) => link.color || getLinkColor(link)}
        linkWidth={1}
        linkOpacity={0.5}
        backgroundColor="#00000000"
        nodeThreeObject={createNodeObjectWithAnimation}
        nodeThreeObjectExtend={false}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={(d) => 
          userProgress.completedNodes.includes(d.source.id) ? 0.01 : 0
        }
        linkDirectionalParticleWidth={2}
        enableNodeDrag={false}
        enableNavigationControls={true}
        cameraPosition={{ x: 0, y: 0, z: 300 }}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
      
      {/* Node info panel */}
      {showInfo && selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {selectedNode.type === 'module' && <BookOpen className="h-5 w-5 text-blue-500" />}
                {selectedNode.type === 'lesson' && <BookOpen className="h-5 w-5 text-green-500" />}
                {selectedNode.type === 'quiz' && <Zap className="h-5 w-5 text-yellow-500" />}
                {selectedNode.type === 'challenge' && <Trophy className="h-5 w-5 text-orange-500" />}
                {selectedNode.type === 'skill' && <CheckCircle2 className="h-5 w-5 text-purple-500" />}
                <h3 className="font-bold text-lg">{selectedNode.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={handleCloseInfo}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Badge variant={selectedNode.status === 'locked' ? 'outline' : 'default'} className={
                  selectedNode.status === 'completed' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : selectedNode.status === 'available' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {selectedNode.status === 'locked' && <Lock className="w-3 h-3 mr-1" />}
                  {selectedNode.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                </Badge>
                
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  {selectedNode.difficulty}
                </Badge>
                
                {selectedNode.pointsReward && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Trophy className="w-3 h-3 mr-1" />
                    {selectedNode.pointsReward} pts
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600">{selectedNode.description}</p>
              
              {/* Prerequisites */}
              {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-700">Prerequisites:</h4>
                  <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                    {selectedNode.prerequisites.map((prereq, i) => (
                      <li key={i}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Action button */}
              <div className="mt-4">
                {selectedNode.status === 'locked' ? (
                  <Button disabled className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Locked
                  </Button>
                ) : selectedNode.status === 'completed' ? (
                  <Button variant="outline" className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Course Completion Progress Summary */}
      {showProgressSummary && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-2 text-white z-10 flex items-center gap-3">
          <div className="text-sm">
            <div className="font-semibold">Course Progress</div>
            <div className="text-xs">{userProgress.completedNodes.length} of {graphData.nodes.length} completed</div>
          </div>
          <div className="relative w-36 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              style={{ width: `${userProgress.totalProgress}%` }}
            ></div>
          </div>
          <div className="font-bold text-lg">{userProgress.totalProgress}%</div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 left-4 space-x-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/10 text-white hover:bg-white/20"
          onClick={() => graphRef.current?.zoomToFit(1000, 50)}
        >
          Reset View
        </Button>
        
        {/* Highlight current node button - only show if currentNode is set */}
        {userProgress.currentNode && (
          <Button
            size="sm"
            variant="secondary"
            className="bg-primary/80 text-white hover:bg-primary"
            onClick={() => {
              // Find the current node
              const currentNode = graphData.nodes.find(n => n.id === userProgress.currentNode);
              if (currentNode) {
                handleNodeClick(currentNode);
              }
            }}
          >
            Current Lesson
          </Button>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 p-2 bg-black/30 rounded-lg text-xs text-white">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-full bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-full bg-blue-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-full bg-gray-500 opacity-60"></div>
            <span>Locked</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="w-3 h-3 mr-1 text-white" />
            <span>Module/Lesson</span>
          </div>
          <div className="flex items-center">
            <Zap className="w-3 h-3 mr-1 text-white" />
            <span>Quiz</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-3 h-3 mr-1 text-white" />
            <span>Challenge</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeGraph;


//
// client/src/components/SkillTreeGraph.tsx
// import React, { useRef, useEffect, useState } from 'react';
// import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
// import * as THREE from 'three';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ChevronRight, BookOpen, Lock, CheckCircle2, Trophy, Zap } from 'lucide-react';
// import { fetchWithAuth } from '@/lib/fetchWithAuth';

// interface GraphNode {
//   id: string;
//   name: string;
//   level: number;
//   status: 'locked' | 'available' | 'completed';
//   type: 'skill' | 'module' | 'lesson' | 'quiz' | 'challenge';
//   description?: string;
//   pointsReward?: number;
//   color?: string;
//   size?: number;
//   difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
//   prerequisites?: string[];
//   // these will be assigned at runtime by ForceGraph3D
//   x?: number;
//   y?: number;
//   z?: number;
// }

// interface GraphLink {
//   source: string;
//   target: string;
//   strength?: number;
//   color?: string;
// }

// interface SkillTreeGraphProps {
//   courseId: number;
//   initialData?: { nodes: GraphNode[]; links: GraphLink[] };
//   onNodeClick?: (node: GraphNode) => void;
//   userProgress?: {
//     completedNodes: string[];
//     totalProgress: number;
//     currentNode?: string;
//   };
//   onNodeComplete?: (nodeId: string) => void;
//   showProgressSummary?: boolean;
// }

// const NODE_COLORS = {
//   locked: '#718096',
//   available: '#3182ce',
//   completed: '#38a169',
// } as const;

// const NODE_SIZES = {
//   skill: 6,
//   module: 8,
//   lesson: 5,
//   quiz: 6,
//   challenge: 7,
// } as const;

// export default function SkillTreeGraph({
//   courseId,
//   initialData,
//   onNodeClick,
//   userProgress = { completedNodes: [], totalProgress: 0 },
//   onNodeComplete,
//   showProgressSummary = true,
// }: SkillTreeGraphProps) {
//   const graphRef = useRef<ForceGraphMethods>();
//   const [loading, setLoading] = useState(!initialData);
//   const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>(
//     initialData || { nodes: [], links: [] }
//   );
//   const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
//   const [showInfo, setShowInfo] = useState(false);
//   const [completionAnimation, setCompletionAnimation] = useState<{ nodeId: string; active: boolean } | null>(
//     null
//   );

//   // Set initial camera position once
//   useEffect(() => {
//     if (graphRef.current) {
//       graphRef.current.cameraPosition({ x: 0, y: 0, z: 300 }, undefined, 0);
//     }
//   }, []);

//   // Fetch skill-tree data if not passed in
//   useEffect(() => {
//     if (!initialData) fetchSkillTreeData();
//   }, [courseId, initialData]);

//   async function fetchSkillTreeData() {
//     setLoading(true);
//     try {
//       const res = await fetchWithAuth(`/api/courses/${courseId}/skill-tree`);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data: { nodes: GraphNode[]; links: GraphLink[] } = await res.json();
//       setGraphData(data);
//     } catch (err) {
//       console.error('Error fetching skill tree:', err);
//       // fallback to sample data
//       setGraphData(generateSampleSkillTree());
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleNodeClick(node: GraphNode) {
//     setSelectedNode(node);
//     setShowInfo(true);
//     onNodeClick?.(node);

//     if (
//       onNodeComplete &&
//       node.status === 'available' &&
//       !userProgress.completedNodes.includes(node.id)
//     ) {
//       setCompletionAnimation({ nodeId: node.id, active: true });
//       setTimeout(() => onNodeComplete(node.id), 1000);
//       setTimeout(() => setCompletionAnimation(null), 2000);
//     }

//     const { x, y, z } = node;
//     if (graphRef.current && x != null && y != null && z != null) {
//       const distance = 40;
//       const distRatio = 1 + distance / Math.hypot(x, y, z);
//       graphRef.current.cameraPosition(
//         { x: x * distRatio, y: y * distRatio, z: z * distRatio },
//         { x, y, z },
//         1500
//       );
//     }
//   }

//   const createNodeObjectWithAnimation = (node: GraphNode) => {
//     let color = node.color || NODE_COLORS[node.status];
//     let size = node.size || NODE_SIZES[node.type];

//     if (completionAnimation?.active && completionAnimation.nodeId === node.id) {
//       size *= 1.5;
//       color = NODE_COLORS.completed;
//     }
//     if (userProgress.completedNodes.includes(node.id) && node.status !== 'completed') {
//       color = NODE_COLORS.completed;
//     }

//     let geometry: THREE.BufferGeometry;
//     switch (node.type) {
//       case 'skill':
//         geometry = new THREE.OctahedronGeometry(size);
//         break;
//       case 'module':
//         geometry = new THREE.BoxGeometry(size, size, size);
//         break;
//       case 'lesson':
//         geometry = new THREE.SphereGeometry(size);
//         break;
//       case 'quiz':
//         geometry = new THREE.TetrahedronGeometry(size);
//         break;
//       case 'challenge':
//         geometry = new THREE.TorusGeometry(size, size / 3, 16, 100);
//         break;
//       default:
//         geometry = new THREE.SphereGeometry(size);
//     }

//     return new THREE.Mesh(
//       geometry,
//       new THREE.MeshLambertMaterial({
//         color,
//         transparent: node.status === 'locked',
//         opacity: node.status === 'locked' ? 0.6 : 1,
//       })
//     );
//   };

//   const getNodeLabel = (node: GraphNode) =>
//     `<div style="
//       color:white;
//       background:rgba(0,0,0,0.7);
//       padding:4px 8px;
//       border-radius:4px;
//       font-size:12px;
//       pointer-events:none;
//     ">
//       <strong>${node.name}</strong>
//       ${node.difficulty ? `<div>Level: ${node.difficulty}</div>` : ''}
//       <div>Status: ${node.status}</div>
//     </div>`;

//   const getLinkColor = (link: GraphLink) => {
//     const src = graphData.nodes.find(n => n.id === link.source);
//     const tgt = graphData.nodes.find(n => n.id === link.target);
//     if (!src || !tgt) return '#aaa';
//     if (src.status === 'completed' && tgt.status === 'completed') return NODE_COLORS.completed;
//     if (src.status === 'completed' && tgt.status === 'available') return NODE_COLORS.available;
//     return NODE_COLORS.locked;
//   };

//   function generateSampleSkillTree() {
//     const nodes: GraphNode[] = [
//       { id: 'programming_basics', name: 'Programming Fundamentals', type: 'module', level: 1, status: 'completed', difficulty: 'beginner', pointsReward: 100 },
//       { id: 'variables', name: 'Variables & Data Types', type: 'lesson', level: 1, status: 'completed', difficulty: 'beginner', pointsReward: 25 },
//       { id: 'control_structures', name: 'Control Structures', type: 'lesson', level: 1, status: 'completed', difficulty: 'beginner', pointsReward: 25 },
//       { id: 'functions', name: 'Functions', type: 'lesson', level: 1, status: 'completed', difficulty: 'beginner', pointsReward: 30 },
//       { id: 'basics_quiz', name: 'Programming Basics Quiz', type: 'quiz', level: 1, status: 'completed', difficulty: 'beginner', pointsReward: 50 },
//       { id: 'oop_basics', name: 'Object-Oriented Programming', type: 'module', level: 2, status: 'available', difficulty: 'intermediate', pointsReward: 150 },
//       { id: 'classes_objects', name: 'Classes & Objects', type: 'lesson', level: 2, status: 'available', difficulty: 'intermediate', pointsReward: 35 },
//       { id: 'inheritance', name: 'Inheritance', type: 'lesson', level: 2, status: 'locked', difficulty: 'intermediate', pointsReward: 40 },
//       { id: 'polymorphism', name: 'Polymorphism', type: 'lesson', level: 2, status: 'locked', difficulty: 'intermediate', pointsReward: 45 },
//       { id: 'oop_challenge', name: 'OOP Challenge', type: 'challenge', level: 2, status: 'locked', difficulty: 'intermediate', pointsReward: 75 },
//       { id: 'advanced_topics', name: 'Advanced Programming', type: 'module', level: 3, status: 'locked', difficulty: 'advanced', pointsReward: 200 },
//       { id: 'algorithms', name: 'Algorithms & Data Structures', type: 'skill', level: 3, status: 'locked', difficulty: 'advanced', pointsReward: 100 },
//       { id: 'design_patterns', name: 'Design Patterns', type: 'skill', level: 3, status: 'locked', difficulty: 'advanced', pointsReward: 100 },
//       { id: 'final_project', name: 'Final Course Project', type: 'challenge', level: 3, status: 'locked', difficulty: 'expert', pointsReward: 300 },
//     ];
//     const links: GraphLink[] = [
//       { source: 'programming_basics', target: 'variables', strength: 0.7 },
//       { source: 'programming_basics', target: 'control_structures', strength: 0.7 },
//       { source: 'programming_basics', target: 'functions', strength: 0.7 },
//       { source: 'programming_basics', target: 'basics_quiz', strength: 0.9 },
//       { source: 'variables', target: 'control_structures', strength: 0.5 },
//       { source: 'control_structures', target: 'functions', strength: 0.5 },
//       { source: 'functions', target: 'basics_quiz', strength: 0.5 },
//       { source: 'programming_basics', target: 'oop_basics', strength: 0.8 },
//       { source: 'basics_quiz', target: 'oop_basics', strength: 0.6 },
//       { source: 'oop_basics', target: 'classes_objects', strength: 0.7 },
//       { source: 'oop_basics', target: 'inheritance', strength: 0.7 },
//       { source: 'oop_basics', target: 'polymorphism', strength: 0.7 },
//       { source: 'oop_basics', target: 'oop_challenge', strength: 0.9 },
//       { source: 'classes_objects', target: 'inheritance', strength: 0.5 },
//       { source: 'inheritance', target: 'polymorphism', strength: 0.5 },
//       { source: 'polymorphism', target: 'oop_challenge', strength: 0.5 },
//       { source: 'oop_basics', target: 'advanced_topics', strength: 0.8 },
//       { source: 'oop_challenge', target: 'advanced_topics', strength: 0.6 },
//       { source: 'advanced_topics', target: 'algorithms', strength: 0.7 },
//       { source: 'advanced_topics', target: 'design_patterns', strength: 0.7 },
//       { source: 'advanced_topics', target: 'final_project', strength: 0.9 },
//       { source: 'algorithms', target: 'final_project', strength: 0.5 },
//       { source: 'design_patterns', target: 'final_project', strength: 0.5 },
//     ];
//     return { nodes, links };
//   }

//   if (loading) {
//     return (
//       <div className="h-[500px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
//         <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-[600px] w-full rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
//       <ForceGraph3D
//         ref={graphRef}
//         graphData={graphData}
//         nodeLabel={getNodeLabel}
//         nodeColor={node =>
//           userProgress.completedNodes.includes(node.id)
//             ? NODE_COLORS.completed
//             : node.color || NODE_COLORS[node.status]
//         }
//         linkColor={link => link.color || getLinkColor(link)}
//         linkWidth={1}
//         linkOpacity={0.5}
//         backgroundColor="transparent"
//         nodeThreeObject={createNodeObjectWithAnimation}
//         nodeThreeObjectExtend={false}
//         onNodeClick={handleNodeClick}
//         cooldownTicks={100}
//         linkDirectionalParticles={2}
//         linkDirectionalParticleSpeed={(d: any) =>
//           userProgress.completedNodes.includes((d.source as GraphNode).id) ? 0.01 : 0
//         }
//         linkDirectionalParticleWidth={2}
//         enableNodeDrag={false}
//         enableNavigationControls={true}
//         d3AlphaDecay={0.02}
//         d3VelocityDecay={0.3}
//       />

//       {/* Node Info Panel */}
//       {showInfo && selectedNode && (
//         <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 w-80">
//           <div className="flex justify-between items-start">
//             <h3 className="font-bold">{selectedNode.name}</h3>
//             <Button variant="ghost" size="sm" onClick={() => setShowInfo(false)}>
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//           <p className="mt-2 text-sm text-gray-600">{selectedNode.description}</p>
//           {/* …additional badges/actions… */}
//         </div>
//       )}

//       {/* Progress Summary */}
//       {showProgressSummary && (
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-2 text-white flex items-center gap-3">
//           <div className="text-sm">
//             {userProgress.completedNodes.length} / {graphData.nodes.length} completed
//           </div>
//           <div className="w-36 h-3 bg-gray-700 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
//               style={{ width: `${userProgress.totalProgress}%` }}
//             />
//           </div>
//           <div className="font-bold">{userProgress.totalProgress}%</div>
//         </div>
//       )}
//     </div>
//   );
// }
