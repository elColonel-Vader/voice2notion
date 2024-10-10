import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Mic, Send } from 'lucide-react';

const categories = ["Work", "Personal", "Ideas", "To-Do"];

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [title, setTitle] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      const response = await fetch('/api/getNotionDatabases');
      const data = await response.json();
      setDatabases(data);
    } catch (error) {
      console.error('Error fetching databases:', error);
      setDebugInfo(JSON.stringify(error));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement speech recognition logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop speech recognition and update transcription
  };

  const sendToNotion = async () => {
    try {
      const response = await fetch('/api/sendToNotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseId: selectedDatabase,
          title,
          content: transcription,
          category: selectedCategory,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Note sent to Notion successfully',
        });
      } else {
        throw new Error('Failed to send note to Notion');
      }
    } catch (error) {
      console.error('Error sending to Notion:', error);
      setDebugInfo(JSON.stringify(error));
      toast({
        title: 'Error',
        description: 'Failed to send note to Notion',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Sprache zu Notion</h1>
      
      <Select onValueChange={(value) => setSelectedDatabase(value)}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select Notion database" />
        </SelectTrigger>
        <SelectContent>
          {databases.map((db) => (
            <SelectItem key={db.id} value={db.id}>
              {db.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className="w-full mb-4"
      >
        <Mic className="mr-2 h-4 w-4" />
        {isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
      </Button>

      <textarea
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
        placeholder="Transcription"
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />

      <Select onValueChange={(value) => setSelectedCategory(value)}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={sendToNotion} className="w-full mb-4">
        <Send className="mr-2 h-4 w-4" />
        An Notion senden
      </Button>

      {debugInfo && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
          <pre className="bg-gray-100 p-2 rounded">{debugInfo}</pre>
        </div>
      )}
    </div>
  );
}

export default App;