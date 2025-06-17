import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Get directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract links from markdown content
function extractLinks(content) {
  // Handle standard markdown links
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  // Also handle HTML links in markdown/mdx
  const htmlLinkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/g;
  
  const links = [];
  let match;
  
  // Process markdown style links
  while ((match = linkRegex.exec(content)) !== null) {
    let url = match[2];
    
    // Extract just the URL if there's a title in quotes after it
    if (url.includes(' "') || url.includes(" '")) {
      url = url.split(/\s+["']/)[0];
    }
    
    // Skip internal links, anchors, and image references
    if (!url.startsWith('#') && !url.startsWith('/') && !url.startsWith('.') && 
        !url.startsWith('mailto:') && !url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      links.push({
        text: match[1],
        url: url,
        line: content.substring(0, match.index).split('\n').length,
        type: 'markdown'
      });
    }
  }
  
  // Process HTML style links
  while ((match = htmlLinkRegex.exec(content)) !== null) {
    const url = match[1];
    
    // Skip internal links, anchors, and image references
    if (!url.startsWith('#') && !url.startsWith('/') && !url.startsWith('.') && 
        !url.startsWith('mailto:') && !url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      links.push({
        text: 'HTML link',
        url: url,
        line: content.substring(0, match.index).split('\n').length,
        type: 'html'
      });
    }
  }
  
  return links;
}

// Function to check if a URL is valid
function checkUrl(url) {
  return new Promise((resolve) => {
    // Sanitize the URL - sometimes markdown links have titles in quotes after the URL
    try {
      // Extract just the URL part if there are spaces (indicating a title might follow)
      if (url.includes(' ')) {
        url = url.split(' ')[0];
      }
      
      // Remove any quotes that might be part of the URL string
      url = url.replace(/['"]/g, '');
      
      // Validate the URL is properly formatted
      new URL(url);
    } catch (error) {
      return resolve({
        url,
        status: 'INVALID URL FORMAT',
        valid: false,
        error: error.message
      });
    }
    
    const client = url.startsWith('https:') ? https : http;
    const options = {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)'
      }
    };
    
    try {
      const req = client.request(url, options, (res) => {
        // Some sites reject HEAD requests, so if we get a 405, try with GET
        if (res.statusCode === 405) {
          options.method = 'GET';
          const getReq = client.request(url, options, (getRes) => {
            resolve({
              url,
              status: getRes.statusCode,
              valid: getRes.statusCode >= 200 && getRes.statusCode < 400
            });
          });
          getReq.on('error', (err) => {
            resolve({
              url,
              status: 'ERROR',
              valid: false,
              error: err.message
            });
          });
          getReq.end();
        } else {
          resolve({
            url,
            status: res.statusCode,
            valid: res.statusCode >= 200 && res.statusCode < 400
          });
        }
      });
      
      req.on('error', (err) => {
        resolve({
          url,
          status: 'ERROR',
          valid: false,
          error: err.message
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 'TIMEOUT',
          valid: false
        });
      });
      
      req.end();
    } catch (error) {
      resolve({
        url,
        status: 'EXCEPTION',
        valid: false,
        error: error.message
      });
    }
  });
}

// Main function to check all blog posts
async function checkBlogLinks() {
  const blogDir = path.join(__dirname, 'src', 'content', 'blog');
  const files = fs.readdirSync(blogDir);
  
  console.log('🔍 Checking links in blog posts...\n');
  
  let totalLinks = 0;
  let validLinks = 0;
  let brokenLinks = 0;
  const brokenLinksList = [];
  
  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const links = extractLinks(content);
      
      if (links.length > 0) {
        console.log(`📄 ${file}`);
        
        for (const link of links) {
          totalLinks++;
          const result = await checkUrl(link.url);
          const status = result.valid ? '✅' : '❌';
          
          if (result.valid) {
            validLinks++;
            console.log(`  ${status} Line ${link.line}: ${link.url} (${result.status})`);
          } else {
            brokenLinks++;
            const errorDetails = result.error ? ` - ${result.error}` : '';
            console.log(`  ${status} Line ${link.line}: ${link.url} (${result.status}${errorDetails})`);
            
            brokenLinksList.push({
              file,
              line: link.line,
              url: link.url,
              status: result.status,
              error: result.error || ''
            });
          }
          
          // Add delay to be respectful to servers
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('');
      }
    }
  }
  
  // Print summary
  console.log('📊 LINK CHECK SUMMARY');
  console.log('====================');
  console.log(`Total links checked: ${totalLinks}`);
  console.log(`✅ Valid links: ${validLinks}`);
  console.log(`❌ Broken links: ${brokenLinks}`);
  
  if (brokenLinks > 0) {
    console.log('\n❌ BROKEN LINKS SUMMARY');
    console.log('====================');
    brokenLinksList.forEach((item, index) => {
      console.log(`${index + 1}. File: ${item.file}, Line ${item.line}`);
      console.log(`   URL: ${item.url}`);
      console.log(`   Status: ${item.status}${item.error ? ` - ${item.error}` : ''}`);
    });
  }
}

// Run the script
console.log('🔗 Link Checker Starting...');
console.log('====================');
checkBlogLinks()
  .then(() => console.log('\n✅ Link check completed!'))
  .catch(error => console.error('\n❌ Error during link check:', error));